import { stringify } from 'query-string';

import { instance } from './util';

export interface MagentoSimpleCategory {
	id: number;
	parent_id: number;
	name: string;
	is_active: boolean;
	position: number;
	level: number;
	product_count: number;
	children_data: MagentoSimpleCategory[];
}

export async function getCategories() {
	const { data } = await instance.get('/rest/default/V1/categories');

	return data['children_data'] as MagentoSimpleCategory[];
}

export interface MagentoFullCategory {
	id: number;
	parent_id: number;
	name: string;
	is_active: boolean;
	position: number;
	level: number;
	children: string;
	created_at: string;
	updated_at: string;
	path: string;
	available_sort_by: string[];
	include_in_menu: true;
	extension_attributes: Record<string, any>;
	custom_attributes: {
		attribute_code: string;
		value: string;
	}[];
}

export async function getCategory(id: string) {
	const { data } = await instance.get('/rest/default/V1/categories/' + id);

	return data as MagentoFullCategory;
}

export async function getCategoryByKey(key: string) {
	const query = {
		'searchCriteria[filterGroups][0][filters][0][field]': 'url_key',
		'searchCriteria[filterGroups][0][filters][0][value]': key,
		'searchCriteria[filterGroups][0][filters][0][conditionType]': 'eq',
	};
	const { data } = await instance.get('/rest/default/V1/categories/list?' + stringify(query));

	if (data.items.length === 0) {
		throw new Error('Category not found');
	}

	return data.items[0] as MagentoFullCategory;
}
