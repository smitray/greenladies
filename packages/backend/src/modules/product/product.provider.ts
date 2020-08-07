import { Injectable } from '@graphql-modules/di';

import { Product } from '../../magento-sync';
import { getRedisCacheConnection } from '../../redis-connection';

@Injectable()
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

	getProduct(id: string) {
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

		return this.getProduct(id);
	}
}
