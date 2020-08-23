import { Injectable, ProviderScope } from '@graphql-modules/di';

import { Product } from '../../api/product';
import { getRedisCacheConnection } from '../../redis-connection';

@Injectable({ scope: ProviderScope.Request })
export class ProductProvider {
	async getProducts() {
		const productIds = await new Promise<string[]>((resolve, reject) => {
			getRedisCacheConnection().get('productIds', (err, reply) => {
				if (err) {
					return reject(err);
				}

				if (reply === null) {
					return reject('Products not found, reload cache');
				}

				return resolve(JSON.parse(reply));
			});
		});

		return new Promise<Product[]>((resolve, reject) => {
			getRedisCacheConnection().mget(productIds, (err, reply) => {
				if (err) {
					return reject(err);
				}

				resolve(reply.map(jsonProduct => JSON.parse(jsonProduct)));
			});
		});
	}

	getProduct({ id, urlKey, sku }: { id?: string | null; urlKey?: string | null; sku?: string | null }) {
		if (id) {
			return this.getProductById(id);
		}

		if (urlKey) {
			return this.getProductByUrlKey(urlKey);
		}

		if (sku) {
			return this.getProductBySku(sku);
		}

		throw new Error('One identifier must be given');
	}

	getProductById(id: string) {
		return new Promise<Product>((resolve, reject) => {
			getRedisCacheConnection().get('Product:id:' + id, (err, reply) => {
				if (err) {
					return reject(err);
				}

				if (reply === null) {
					return reject(new Error('Product not found'));
				}

				return resolve(JSON.parse(reply));
			});
		});
	}

	async getProductByUrlKey(urlKey: string) {
		const id = await new Promise<string>((resolve, reject) => {
			getRedisCacheConnection().get('Product:urlKey:' + urlKey, (err, reply) => {
				if (err) {
					return reject(err);
				}

				if (reply === null) {
					return reject(new Error('Product not found'));
				}

				return resolve(reply);
			});
		});

		return this.getProductById(id);
	}

	async getProductBySku(sku: string) {
		const id = await new Promise<string>((resolve, reject) => {
			getRedisCacheConnection().get('Product:sku:' + sku, (err, reply) => {
				if (err) {
					return reject(err);
				}

				if (reply === null) {
					return reject(new Error('Product not found'));
				}

				return resolve(reply);
			});
		});

		return this.getProductById(id);
	}
}
