import { stringify } from 'query-string';

import { instance } from './util';

export interface MagentoSimpleProduct {
	sku: string;
}

export async function getProductsByCategoryId(categoryId: string) {
	const { data } = await instance.get('/rest/default/V1/categories/' + categoryId + '/products');

	return data as MagentoSimpleProduct[];
}

export interface MagentoFullProduct {
	id: number;
	sku: string;
	name: string;
	// attribute_set_id: 0;
	price: number;
	// status: 0;
	// visibility: 0;
	type_id: string;
	// created_at: 'string';
	// updated_at: 'string';
	// weight: 0;
}

export async function getProducts(page = 1, pageSize = 10) {
	const query = {
		'searchCriteria[currentPage]': page,
		'searchCriteria[pageSize]': pageSize,
	};
	const { data } = await instance.get('/rest/default/V1/products?' + stringify(query));

	return data.items as MagentoFullProduct[];
}

export async function getProduct(id: number | string) {
	const query = {
		'searchCriteria[filterGroups][0][filters][0][field]': 'entity_id',
		'searchCriteria[filterGroups][0][filters][0][value]': id,
		'searchCriteria[filterGroups][0][filters][0][conditionType]': 'eq',
	};
	const { data } = await instance.get('/rest/default/V1/products?' + stringify(query));

	if (data.items.length === 0) {
		throw new Error('Product not found');
	}

	return data.items[0] as MagentoFullProduct;
}

export async function getProductBySku(sku: string) {
	const { data } = await instance.get('/rest/default/V1/products/' + sku);

	return data as MagentoFullProduct;
}
