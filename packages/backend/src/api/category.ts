import { magentoAdminRequester } from './util';

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
	include_in_menu: boolean;
	extension_attributes: Record<string, any>;
	custom_attributes: {
		attribute_code: string;
		value: string;
	}[];
}

function getCustomAttribute(
	customAttributes: { attribute_code: string; value: string }[],
	code: string,
	required = true,
) {
	const attribute = customAttributes.find(attribute => attribute.attribute_code === code);
	if (!attribute) {
		if (!required) {
			return '';
		}

		throw new Error('Invalid category, must have ' + code + ' attribute');
	}

	return attribute.value;
}

export interface Category {
	id: string;
	name: string;
	urlKey: string;
	parentId: string;
	childrenIds: string[];
}

function transformCategory(category: MagentoFullCategory): Category {
	return {
		id: category.id.toString(),
		name: category.name,
		urlKey: getCustomAttribute(category.custom_attributes, 'url_key', true),
		parentId: category.parent_id.toString(),
		childrenIds: category.children
			.split(',')
			.filter(childId => childId !== '')
			.map(childId => childId.trim()),
	};
}

export async function getCategory(id: number) {
	const { data: category } = await magentoAdminRequester.get<MagentoFullCategory>('/rest/default/V1/categories/' + id);

	return transformCategory(category);
}

function flattenCategories(category: MagentoSimpleCategory): MagentoSimpleCategory[] {
	return [category, ...category.children_data.flatMap(flattenCategories)];
}

async function expandCategory(simpleCategory: MagentoSimpleCategory) {
	return getCategory(simpleCategory.id);
}

export async function getCategories() {
	const { data } = await magentoAdminRequester.get('/rest/default/V1/categories');

	const rootCategories = data['children_data'] as MagentoSimpleCategory[];

	return Promise.all(rootCategories.flatMap(flattenCategories).map(expandCategory));
}
