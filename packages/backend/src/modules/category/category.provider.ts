import { Injectable, ProviderScope } from '@graphql-modules/di';

import { getCategories, getCategory, getRootCategories } from '../../magento-sync';

@Injectable({ scope: ProviderScope.Request })
export class CategoryProvider {
	getCategory(id: string) {
		return getCategory({ id });
	}

	getCategoryByUrlKey(urlKey: string) {
		return getCategory({ urlKey });
	}

	getCategories() {
		return getCategories();
	}

	getRootCategories() {
		return getRootCategories();
	}
}
