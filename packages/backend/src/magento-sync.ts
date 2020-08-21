import { getCategories, MagentoFullCategory } from './api/category';
import { getProducts, getProductsByCategoryId, MagentoFullProduct } from './api/product';
import { getRedisCacheConnection } from './redis-connection';

export interface Product {
	id: string;
	sku: string;
	name: string;
	price: number;
	visibility: 'none' | 'catalog' | 'search' | 'catalog+search';
	type: string;
	urlKey: string;
}

function transformVisibility(visibility: number) {
	switch (visibility) {
		case 1:
			return 'none';
		case 2:
			return 'catalog';
		case 3:
			return 'search';
		case 4:
			return 'catalog+search';
		default:
			throw new Error('Invalid visibilty value');
	}
}

function transformProduct(product: MagentoFullProduct): Product {
	return {
		id: String(product.id),
		sku: product.sku,
		name: product.name,
		price: product.price,
		visibility: transformVisibility(product.visibility),
		type: product.type_id,
		// TODO: throw error if not set
		urlKey: product.custom_attributes.find(attribute => attribute.attribute_code === 'url_key')?.value || '',
	};
}

async function saveProductsInCache(products: Product[]) {
	// Save product id => product
	const saveProducts = new Promise((resolve, reject) => {
		getRedisCacheConnection().mset(
			products.reduce<string[]>((prev, current) => {
				return [...prev, 'Product:id:' + current.id, JSON.stringify(current)];
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
			products.reduce<string[]>((prev, current) => {
				if (current.type !== 'virtual' && current.urlKey) {
					return [...prev, 'Product:urlKey:' + current.urlKey, current.id];
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

	// Save product sku => product id
	const mapSkuToId = new Promise((resolve, reject) => {
		getRedisCacheConnection().mset(
			products.reduce<string[]>((prev, current) => {
				if (current.type !== 'virtual' && current.sku) {
					return [...prev, 'Product:sku:' + current.sku, current.id];
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

	const saveProductIds = new Promise((resolve, reject) => {
		getRedisCacheConnection().set('productIds', JSON.stringify(products.map(product => product.id)), (err, reply) => {
			if (err) {
				reject(err);
			}

			resolve(reply);
		});
	});

	return Promise.all([saveProducts, mapUrlKeyToId, mapSkuToId, saveProductIds]);
}

async function syncMagnetoProducts() {
	const magentoProducts = await getProducts({ pageSize: 1000000 });

	const products = magentoProducts.map(transformProduct);

	await saveProductsInCache(products);
}

export interface Category {
	id: string;
	name: string;
	includeInMenu: boolean;
	urlKey: string;
	parentId: string;
	childrenIds: string[];
	productIds: string[];
}

async function transformCategory(category: MagentoFullCategory): Promise<Category> {
	return {
		id: String(category.id),
		name: category.name,
		includeInMenu: category.include_in_menu,
		// TODO: throw error if not set
		urlKey: category.custom_attributes.find(attribute => attribute.attribute_code === 'url_key')?.value || '',
		parentId: String(category.parent_id),
		childrenIds: category.children === '' ? [] : category.children.split(','),
		productIds: (await getProductsByCategoryId(category.id)).map(product => String(product.id)),
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
