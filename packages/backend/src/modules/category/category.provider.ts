import { Injectable } from '@graphql-modules/di';

import { getCategories, getCategory, getCategoryByKey } from '../../api/category';

@Injectable()
export class CategoryProvider {
	getCategories() {
		return getCategories();
	}

	getCategory(id: string) {
		return getCategory(id);
	}

	getCategoryByKey(key: string) {
		return getCategoryByKey(key);
	}
}
