import { instance } from './util';

interface MagentoSimpleCategory {
	id: number;
	parent_id: number;
	name: string;
	is_active: boolean;
	position: number;
	level: number;
	product_count: number;
	children_data: MagentoSimpleCategory[];
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
	include_in_menu: boolean;
	extension_attributes: Record<string, any>;
	custom_attributes: {
		attribute_code: string;
		value: string;
	}[];
}

export async function getCategory(id: number) {
	const { data } = await instance.get('/rest/default/V1/categories/' + id);

	return data as MagentoFullCategory;
}

function flattenCategories(category: MagentoSimpleCategory): MagentoSimpleCategory[] {
	return [category, ...category.children_data.flatMap(flattenCategories)];
}

async function expandCategory(simpleCategory: MagentoSimpleCategory) {
	return getCategory(simpleCategory.id);
}

export async function getCategories() {
	const { data } = await instance.get('/rest/default/V1/categories');

	const rootCategories = data['children_data'] as MagentoSimpleCategory[];

	return Promise.all(rootCategories.flatMap(flattenCategories).map(expandCategory));
}
