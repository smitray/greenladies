import { Category as MagentoCategory, getCategories } from './api/category';
import {
	ConfigurableProduct as MagentoConfigurableProduct,
	getConfigurableProductVirtualProducts,
	getProducts,
	getProductsByCategoryId,
	getRelatedProducts,
	Product as MagentoProduct,
	VirtualProduct as MagentoVirtualProduct,
} from './api/product';
import { getRedisCacheConnection } from './redis-connection';

export type Product = ConfigurableProduct | VirtualProduct;

export interface ConfigurableProduct {
	__type: 'ConfigurableProduct';
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
	image: string;
	images: string[];
	configurationAttributes: string[];
	virtualProductIds: string[];
	sizes: string[];
	colors: string[];
	price: number;
	specialPrice: number;
	currency: string;
	relatedProductIds: string[];
}

export interface VirtualProduct {
	__type: 'VirtualProduct';
	id: string;
	sku: string;
	name: string;
	quantity: number;
	brand: string;
	price: {
		originalPrice: number;
		specialPrice: number;
		currency: string;
	};
	colors: string[];
	size: string;
	parentId: string;
}

async function transformConfigurableProduct(product: MagentoConfigurableProduct): Promise<ConfigurableProduct> {
	const virtualProducts = await getConfigurableProductVirtualProducts(product.sku);
	if (virtualProducts[0].__type !== 'VirtualProduct') {
		throw new Error('Only virtual products should be returned');
	}

	const relatedProducts = await getRelatedProducts(product.sku);

	return {
		...product,
		sizes: [
			...new Set(
				virtualProducts.map(virtualProduct => {
					if (virtualProduct.__type !== 'VirtualProduct') {
						throw new Error('Only virtual products should be returned');
					}

					return virtualProduct.size;
				}),
			),
		],
		colors: [
			...new Set(
				virtualProducts.flatMap(virtualProduct => {
					if (virtualProduct.__type !== 'VirtualProduct') {
						throw new Error('Only virtual products should be returned');
					}

					return virtualProduct.colors;
				}),
			),
		],
		price: virtualProducts[0].price.originalPrice,
		specialPrice: virtualProducts[0].price.specialPrice,
		currency: virtualProducts[0].price.currency,
		relatedProductIds: relatedProducts.map(relatedProduct => relatedProduct.id),
	};
}

function transformVirtualProduct(product: MagentoVirtualProduct): VirtualProduct {
	return {
		...product,
		parentId: '',
	};
}

async function transformProduct(product: MagentoProduct): Promise<Product> {
	switch (product.__type) {
		case 'ConfigurableProduct':
			return transformConfigurableProduct(product);
		case 'VirtualProduct':
			return transformVirtualProduct(product);
		default:
			throw new Error('Invalid product type');
	}
}

async function saveProductsInCache(products: Product[]) {
	const redisConn = getRedisCacheConnection();
	const saveProducts = new Promise((resolve, reject) => {
		redisConn.mset(
			products.reduce<string[]>((prevEntries, product) => {
				const entries: string[] = [];
				// Product id => product
				entries.push(`Product:id:${product.id}`, JSON.stringify(product));

				// Product urlKey => product id
				if (product.__type === 'ConfigurableProduct') {
					entries.push(`Product:urlKey:${product.urlKey}`, product.id);
				}

				// Product sku => product id
				entries.push(`Product:sku:${product.sku}`, product.id);

				return [...prevEntries, ...entries];
			}, []),
			(err, reply) => {
				if (err) {
					reject(err);
				}

				resolve(reply);
			},
		);
	});

	const productIds = products.filter(product => product.__type === 'ConfigurableProduct').map(product => product.id);
	const saveProductIds = new Promise((resolve, reject) => {
		redisConn.set('productIds', JSON.stringify(productIds), (err, reply) => {
			if (err) {
				reject(err);
			}

			resolve(reply);
		});
	});

	const updateParentIdsOnVirtualProducts = saveProducts.then(() => {
		productIds.map(productId => {
			redisConn.get('Product:id:' + productId, (_error, configurableProductValue) => {
				if (configurableProductValue) {
					const configurableProduct = JSON.parse(configurableProductValue);
					const virtualProductIds: string[] = configurableProduct.virtualProductIds;
					redisConn.mget(
						virtualProductIds.map(id => 'Product:id:' + id),
						(_error, virtualProductsValue) => {
							if (virtualProductsValue) {
								redisConn.mset(
									virtualProductsValue.reduce<string[]>((prev, current) => {
										const virtualProduct = JSON.parse(current);
										return [
											...prev,
											'Product:id:' + virtualProduct.id,
											JSON.stringify({
												...virtualProduct,
												parentId: productId,
											}),
										];
									}, []),
								);
							}
						},
					);
				}
			});
		});
	});

	return Promise.all([saveProducts, updateParentIdsOnVirtualProducts, saveProductIds]);
}

async function syncMagnetoProducts() {
	const magentoProducts = await getProducts({ pageSize: 1000000 });

	const products = await Promise.all(magentoProducts.map(transformProduct));

	await saveProductsInCache(products);
}

export interface Category {
	id: string;
	name: string;
	urlKey: string;
	parentId: string;
	childrenIds: string[];
	productIds: string[];
}

async function transformCategory(category: MagentoCategory): Promise<Category> {
	return {
		...category,
		productIds: (await getProductsByCategoryId(category.id))
			.filter(product => product.__type === 'ConfigurableProduct')
			.map(product => String(product.id)),
	};
}

async function saveCategoriesInCache(categories: Category[]) {
	// Save category id => category
	const saveCategories = new Promise((resolve, reject) => {
		getRedisCacheConnection().mset(
			categories.reduce<string[]>((prev, current) => {
				return [...prev, 'Category:id:' + current.id, JSON.stringify(current)];
			}, []),
			(err, reply) => {
				if (err) {
					reject(err);
				}

				resolve(reply);
			},
		);
	});

	// Save product urlKey => product id
	const mapUrlKeyToId = new Promise((resolve, reject) => {
		getRedisCacheConnection().mset(
			categories.reduce<string[]>((prev, current) => {
				if (current.urlKey) {
					return [...prev, 'Category:urlKey:' + current.urlKey, current.id];
				}

				return prev;
			}, []),
			(err, reply) => {
				if (err) {
					reject(err);
				}

				resolve(reply);
			},
		);
	});

	return Promise.all([saveCategories, mapUrlKeyToId]);
}

async function syncMagnetoCategories() {
	const magentoCategories = await getCategories();

	const categories = await Promise.all(magentoCategories.map(transformCategory));

	await saveCategoriesInCache(categories);
}

export async function syncMagentoProductsAndCategories() {
	await Promise.all([syncMagnetoProducts(), syncMagnetoCategories()]);
}
