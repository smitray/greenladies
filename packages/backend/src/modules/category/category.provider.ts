import { Injectable } from '@graphql-modules/di';

import { getCategories, getCategory } from '../../api/category';

@Injectable()
export class CategoryProvider {
	getRootCategory() {
		return getCategories();
	}

	getCategory(id: string) {
		return getCategory(id);
	}
}
