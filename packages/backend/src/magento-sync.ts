import { Category as MagentoCategory, getCategories } from './api/category';
import { getProducts, getProductsByCategoryId, Product } from './api/product';
import { getRedisCacheConnection } from './redis-connection';

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
	const products = await getProducts({ pageSize: 1000000 });

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
