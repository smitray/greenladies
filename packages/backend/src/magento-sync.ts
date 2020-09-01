import { getCategories } from './api/category';
import {
	ConfigurableProduct as MagentoConfigurableProduct,
	getProducts,
	getProductStock,
	ProductConfiguration as MagentoProductConfiguration,
} from './api/product';
import { getRedisCache } from './redis-connection';
import { chunk } from './utils/array';

export interface ConfigurableProduct {
	id: string;
	sku: string;
	urlKey: string;
	name: string;
	brand: string;
	metaData: {
		title: string;
		keyword: string;
		description: string;
	};
	description: {
		short: string;
		full: string;
	};
	washingDescription: string;
	condition: string;
	material: string;
	image: string;
	images: string[];
	productConfigurationIds: string[];
	sizes: string[];
	colors: string[];
	price: number;
	specialPrice: number;
	currency: string;
	relatedProductIds: string[];
}

export interface ProductConfiguration {
	__type: 'SimpleProduct';
	id: string;
	sku: string;
	name: string;
	quantity: number;
	price: {
		originalPrice: number;
		specialPrice: number;
		currency: string;
	};
	colors: string[];
	size: string;
	parentId: string;
}

export interface Category {
	id: string;
	name: string;
	urlKey: string;
	includeInMenu: boolean;
	parentId: string;
	childrenIds: string[];
	productIds: string[];
}

export async function syncMagentoProductsAndCategories() {
	const magentoCategories = await getCategories();

	const magentoProducts = await getProducts({ pageSize: 1000000 });

	const brands = new Set<string>();
	const productConfigurationParentIds = new Map<string, string>();
	const categoriesProductIds = new Map<string, string[]>();
	const configurableProducts: MagentoConfigurableProduct[] = [];
	const productConfigurations: MagentoProductConfiguration[] = [];
	for (const product of magentoProducts) {
		switch (product.__type) {
			case 'ConfigurableProduct':
				{
					brands.add(product.brand);
					configurableProducts.push(product);
					for (const categoryId of product.categoryIds) {
						const categoryProductIds = categoriesProductIds.get(categoryId);
						if (categoryProductIds) {
							categoriesProductIds.set(categoryId, [...categoryProductIds, product.id]);
						} else {
							categoriesProductIds.set(categoryId, [product.id]);
						}
					}

					for (const productConfigurationId of product.productConfigurationIds) {
						productConfigurationParentIds.set(productConfigurationId, product.id);
					}
				}
				break;
			case 'SimpleProduct':
				{
					productConfigurations.push(product);
				}
				break;
		}
	}

	const productStock = new Map<string, number>();
	const STOCK_FETCH_CHUNK_SIZE = 50;
	const STOCK_FETCH_CHUNK_TIME_GAP_MS = 1000;
	const chunkedProductConfigurations = chunk(productConfigurations, STOCK_FETCH_CHUNK_SIZE);
	for (let index = 0; index < chunkedProductConfigurations.length; index++) {
		const productsChunk = chunkedProductConfigurations[index];
		if (index !== 0) {
			await new Promise(resolve => {
				setTimeout(() => {
					resolve();
				}, STOCK_FETCH_CHUNK_TIME_GAP_MS);
			});
		}

		await Promise.all(
			productsChunk.map(product =>
				getProductStock(product.sku).then(stock => productStock.set(product.id, stock.salableQuantity)),
			),
		);
	}

	const skuToConfigurableProductMap = new Map(configurableProducts.map(product => [product.sku, product]));
	const idToProductConfigurationMap = new Map(productConfigurations.map(product => [product.id, product]));

	const transformedCategories = magentoCategories.map<Category>(category => {
		return {
			...category,
			productIds: categoriesProductIds.get(category.id) || [],
		};
	});

	const transformedConfigurableProducts = configurableProducts.map<ConfigurableProduct>(product => {
		const productConfigurationsLocal = product.productConfigurationIds.map(id => {
			const productConfiguration = idToProductConfigurationMap.get(id);
			if (!productConfiguration) {
				throw new Error(`Product configuration ${id} for product ${product.id} could not be found`);
			}

			return productConfiguration;
		});

		const relatedProductIds = product.relatedProductSkus.map(sku => {
			const relatedProduct = skuToConfigurableProductMap.get(sku);
			if (!relatedProduct) {
				throw new Error(`Related product ${sku} for product ${product.id} could not be found`);
			}

			return relatedProduct.id;
		});

		const firstProductConfiguration = productConfigurationsLocal[0];

		return {
			...product,
			colors: [...new Set(productConfigurationsLocal.flatMap(configuration => configuration.colors))],
			sizes: [...new Set(productConfigurationsLocal.map(configuration => configuration.size))],
			price: firstProductConfiguration.price.originalPrice,
			specialPrice: firstProductConfiguration.price.specialPrice,
			currency: firstProductConfiguration.price.currency,
			relatedProductIds,
		};
	});

	const transformedProductConfigurations = productConfigurations.map<ProductConfiguration>(configuration => {
		const parentId = productConfigurationParentIds.get(configuration.id);
		if (!parentId) {
			throw new Error(`Could not get parent for configuration ${configuration.id}`);
		}

		const salableQuantity = productStock.get(configuration.id);
		if (salableQuantity === undefined) {
			throw new Error(`Could not get quantity for configuration ${configuration.id}`);
		}

		return {
			...configuration,
			parentId,
			quantity: salableQuantity,
		};
	});

	const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
	const redisCache = getRedisCache();
	const redisCategories = redisCache.setMany(
		transformedCategories.flatMap<any>(category => [
			{ key: `Category:id:${category.id}`, value: category, expiresInSeconds: ONE_DAY_IN_SECONDS },
			{ key: `Category:urlKey:${category.urlKey}`, value: category.id, expiresInSeconds: ONE_DAY_IN_SECONDS },
		]),
	);

	const redisRootCategories = redisCache.set(
		'rootCategoryIds',
		transformedCategories.filter(category => category.parentId === '2').map(category => category.id),
		ONE_DAY_IN_SECONDS,
	);

	const redisConfigurableProducts = redisCache.setMany(
		transformedConfigurableProducts.flatMap<any>(product => [
			{ key: `ConfigurableProduct:id:${product.id}`, value: product, expiresInSeconds: ONE_DAY_IN_SECONDS },
			{ key: `ConfigurableProduct:sku:${product.sku}`, value: product.id, expiresInSeconds: ONE_DAY_IN_SECONDS },
			{ key: `ConfigurableProduct:urlKey:${product.urlKey}`, value: product.id, expiresInSeconds: ONE_DAY_IN_SECONDS },
		]),
	);

	const redisProductConfigurations = redisCache.setMany(
		transformedProductConfigurations.flatMap<any>(configuration => [
			{
				key: `ProductConfiguration:id:${configuration.id}`,
				value: configuration,
				expiresInSeconds: ONE_DAY_IN_SECONDS,
			},
			{
				key: `ProductConfiguration:sku:${configuration.sku}`,
				value: configuration.id,
				expiresInSeconds: ONE_DAY_IN_SECONDS,
			},
		]),
	);

	const redisAllConfigurableProductIds = redisCache.set(
		'allConfigurableProductIds',
		transformedConfigurableProducts.map(({ id }) => id),
		ONE_DAY_IN_SECONDS,
	);

	const redisBrands = redisCache.set('allBrandNames', [...brands], ONE_DAY_IN_SECONDS);

	const redisAllCategoryIds = redisCache.set(
		'allCategoryIds',
		transformedCategories.map(category => category.id),
		ONE_DAY_IN_SECONDS,
	);

	await Promise.all([
		redisCategories,
		redisRootCategories,
		redisConfigurableProducts,
		redisProductConfigurations,
		redisAllConfigurableProductIds,
		redisBrands,
		redisAllCategoryIds,
	]);
}

export async function getCategory({
	id,
	sku,
	urlKey,
}: {
	id?: string | null;
	sku?: string | null;
	urlKey?: string | null;
}) {
	const redisCache = getRedisCache();
	if (id) {
		return redisCache.get<Category>(`Category:id:${id}`);
	} else if (sku) {
		const id = await redisCache.get<string>(`Category:sku:${sku}`);
		return redisCache.get<Category>(`Category:id:${id}`);
	} else if (urlKey) {
		const id = await redisCache.get<string>(`Category:urlKey:${urlKey}`);
		return redisCache.get<Category>(`Category:id:${id}`);
	} else {
		throw new Error('Provide one of id, sku, and urlKey');
	}
}

export async function getRootCategoryIds() {
	const redisCache = getRedisCache();
	return redisCache.get<string[]>('rootCategoryIds');
}

export async function getConfigurableProduct({
	id,
	sku,
	urlKey,
}: {
	id?: string | null;
	sku?: string | null;
	urlKey?: string | null;
}) {
	const redisCache = getRedisCache();
	if (id) {
		return redisCache.get<ConfigurableProduct>(`ConfigurableProduct:id:${id}`);
	} else if (sku) {
		const id = await redisCache.get<string>(`ConfigurableProduct:sku:${sku}`);
		return redisCache.get<ConfigurableProduct>(`ConfigurableProduct:id:${id}`);
	} else if (urlKey) {
		const id = await redisCache.get<string>(`ConfigurableProduct:urlKey:${urlKey}`);
		return redisCache.get<ConfigurableProduct>(`ConfigurableProduct:id:${id}`);
	} else {
		throw new Error('Provide one of id, sku, and urlKey');
	}
}

export async function getProductConfiguration({ id, sku }: { id?: string | null; sku?: string | null }) {
	const redisCache = getRedisCache();
	if (id) {
		return redisCache.get<ProductConfiguration>(`ProductConfiguration:id:${id}`);
	} else if (sku) {
		const id = await redisCache.get<string>(`ProductConfiguration:sku:${sku}`);
		return redisCache.get<ProductConfiguration>(`ProductConfiguration:id:${id}`);
	} else {
		throw new Error('Provide one of id and sku');
	}
}

export function updateProductConfiguration(configuration: ProductConfiguration) {
	const redisCache = getRedisCache();
	return redisCache.set(`ProductConfiguration:id:${configuration.id}`, configuration);
}

export async function getConfigurableProducts() {
	const redisCache = getRedisCache();
	const configurableProductIds = await redisCache.get<string[]>(`allConfigurableProductIds`);
	return redisCache.getMany<ConfigurableProduct>(configurableProductIds.map(id => `ConfigurableProduct:id:${id}`));
}

export function getBrands() {
	const redisCache = getRedisCache();
	return redisCache.get<string[]>('allBrandNames');
}

export function getCategoryIds() {
	const redisCache = getRedisCache();
	return redisCache.get<string[]>('allCategoryIds');
}
