import { Injectable, ProviderScope } from '@graphql-modules/di';

import { Category } from '../../magento-sync';
import { redisCacheConnection } from '../../redis-connection';

@Injectable({ scope: ProviderScope.Request })
export class CategoryProvider {
	getCategory(id: string) {
		return new Promise<Category>((resolve, reject) => {
			redisCacheConnection.get('Category:id:' + id, (err, reply) => {
				if (err) {
					return reject(err);
				}

				if (reply === null) {
					return reject(new Error('Category not found'));
				}

				return resolve(JSON.parse(reply));
			});
		});
	}

	async getCategoryByUrlKey(urlKey: string) {
		const id = await new Promise<string>((resolve, reject) => {
			redisCacheConnection.get('Category:urlKey:' + urlKey, (err, reply) => {
				if (err) {
					reject(err);
				}

				if (reply === null) {
					return reject(new Error('Category not found'));
				}

				resolve(reply);
			});
		});

		return this.getCategory(id);
	}
}
