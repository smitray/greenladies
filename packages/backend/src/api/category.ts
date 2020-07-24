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

export async function getCategories() {
	const { data } = await instance.get('/rest/default/V1/categories');

	return data['children_data'] as MagentoSimpleCategory[];
}

interface MagentoFullCategory {
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

export async function getCategory(id: string | number) {
	const { data } = await instance.get('/rest/default/V1/categories/' + id);

	return data as MagentoFullCategory;
}
