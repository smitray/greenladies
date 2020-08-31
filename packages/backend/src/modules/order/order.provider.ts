import { Injectable, ProviderScope } from '@graphql-modules/di';

import { getRedisCache } from '../../redis-connection';

@Injectable({ scope: ProviderScope.Request })
export class OrderProvider {
	async getKlarnaOrderConfirmationSnippet(klarnaOrderId: string) {
		const redisCache = getRedisCache();
		return redisCache.get<string>(`klarnaOrderConfirmSnippet:${klarnaOrderId}`);
	}
}
