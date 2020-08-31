import { Injectable, ProviderScope } from '@graphql-modules/di';

import { getCategory, getCategoryIds } from '../../magento-sync';

@Injectable({ scope: ProviderScope.Request })
export class CategoryProvider {
	getCategory(id: string) {
		return getCategory({ id });
	}

	getCategoryByUrlKey(urlKey: string) {
		return getCategory({ urlKey });
	}

	getCategoryIds() {
		return getCategoryIds();
	}
}
