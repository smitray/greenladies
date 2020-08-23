import { Category as MagentoCategory, getCategories } from './api/category';
import {
	ConfigurableProduct as MagentoConfigurableProduct,
	getConfigurableProductVirtualProducts,
	getProducts,
	getProductsByCategoryId,
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
}

export interface VirtualProduct {
	__type: 'VirtualProduct';
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
}

async function transformConfigurableProduct(product: MagentoConfigurableProduct): Promise<ConfigurableProduct> {
	const virtualProducts = await getConfigurableProductVirtualProducts(product.sku);

	return {
		...product,
		sizes: [...new Set(virtualProducts.map(virtualProduct => virtualProduct.size))],
		colors: [...new Set(virtualProducts.flatMap(virtualProduct => virtualProduct.colors))],
		price: virtualProducts[0].price.originalPrice,
		specialPrice: virtualProducts[0].price.specialPrice,
		currency: virtualProducts[0].price.currency,
	};
}

function transformVirtualProduct(product: MagentoVirtualProduct): VirtualProduct {
	return product;
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
	const saveProducts = new Promise((resolve, reject) => {
		getRedisCacheConnection().mset(
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

	const saveProductIds = new Promise((resolve, reject) => {
		getRedisCacheConnection().set('productIds', JSON.stringify(products.map(product => product.id)), (err, reply) => {
			if (err) {
				reject(err);
			}

			resolve(reply);
		});
	});

	return Promise.all([saveProducts, saveProductIds]);
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
