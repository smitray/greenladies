import { stringify } from 'query-string';

import { magentoAdminRequester } from './util';

async function attributeOptions(code: string) {
	const { data } = await magentoAdminRequester.get<{ label: string; value: string }[]>(
		`/rest/default/V1/products/attributes/${code}/options`,
	);

	return data;
}

interface MagentoFullProduct {
	id: number;
	sku: string;
	name: string;
	price: number;
	status: number;
	visibility: number;
	type_id: string;
	created_at: string;
	updated_at: string;
	extension_attributes: {
		category_links: {
			category_id: string;
		}[];
		configurable_product_links: number[];
	};
	product_links: {
		sku: string;
		link_type: string;
		linked_product_sku: string;
		linked_product_type: string;
		position: number;
		extension_attributes: {
			qty: number;
		};
	}[];
	media_gallery_entries: {
		id: number;
		media_type: string;
		label: string;
		position: number;
		disabled: boolean;
		types: string[];
		file: string;
		content: {
			base64_encoded_data: string;
			type: string;
			name: string;
		};
		extension_attributes: {
			video_content: {
				media_type: string;
				video_provider: string;
				video_url: string;
				video_title: string;
				video_description: string;
				video_metadata: string;
			};
		};
	}[];
	custom_attributes: {
		attribute_code: string;
		value: string;
	}[];
}

const attributeValueToLabelCache = new Map<string, { insertedAt: Date; value: string }>();

const ATTRIBUTE_VALUE_TO_LABEL_CACHE_TIME = 1000 * 60 * 15; // 15 minutes

async function attributeValueToLabel(attributeCode: string, value: string) {
	const cacheEntry = attributeValueToLabelCache.get(attributeCode);
	if (cacheEntry && new Date(cacheEntry.insertedAt.getTime() + ATTRIBUTE_VALUE_TO_LABEL_CACHE_TIME) > new Date()) {
		return cacheEntry.value;
	}

	const options = await attributeOptions(attributeCode);
	const option = options.find(option => option.value === value);
	if (!option) {
		throw new Error('Invalid option, this should not happen');
	}

	attributeValueToLabelCache.set(attributeCode, { insertedAt: new Date(), value: option.label });

	return option.label;
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

		throw new Error('Invalid product, must have ' + code + ' attribute');
	}

	return attribute.value;
}

export async function getProductStock(sku: string) {
	const { data } = await magentoAdminRequester.get<{
		qty: number;
		stock_item: {
			qty: number;
		};
	}>(`/rest/default/V1/stockStatuses/${sku}`);

	return {
		salableQuantity: data.qty,
		totalQuantity: data.stock_item.qty,
	};
}

export interface ConfigurableProduct {
	__type: 'ConfigurableProduct';
	enabled: boolean;
	id: string;
	sku: string;
	urlKey: string;
	name: string;
	brand: string;
	metaData: {
		title: string;
		keyword: string;
		description: string;
	};
	description: {
		short: string;
		full: string;
	};
	washingDescription: string;
	condition: string;
	material: string;
	image: string;
	images: string[];
	productConfigurationIds: string[];
	relatedProductSkus: string[];
	categoryIds: string[];
}

export interface ProductConfiguration {
	__type: 'SimpleProduct';
	id: string;
	sku: string;
	enabled: boolean;
	name: string;
	price: {
		originalPrice: number;
		specialPrice: number;
		currency: string;
	};
	colors: string[];
	size: string;
}

export type Product = ConfigurableProduct | ProductConfiguration;

async function transformConfigurableProduct(product: MagentoFullProduct): Promise<ConfigurableProduct> {
	const brandAttribute = getCustomAttribute(product.custom_attributes, 'mgs_brand', true);
	const brand = await attributeValueToLabel('mgs_brand', brandAttribute);

	const conditionAttribute = getCustomAttribute(product.custom_attributes, 'condition', true);
	const condition = await attributeValueToLabel('condition', conditionAttribute);

	return {
		__type: 'ConfigurableProduct',
		id: product.id.toString(),
		sku: product.sku,
		urlKey: getCustomAttribute(product.custom_attributes, 'url_key', true),
		enabled: product.status === 1,
		name: product.name,
		brand,
		metaData: {
			title: getCustomAttribute(product.custom_attributes, 'meta_title', false),
			keyword: getCustomAttribute(product.custom_attributes, 'meta_keyword', false),
			description: getCustomAttribute(product.custom_attributes, 'meta_description', false),
		},
		description: {
			short: getCustomAttribute(product.custom_attributes, 'short_description'),
			full: getCustomAttribute(product.custom_attributes, 'description'),
		},
		washingDescription: getCustomAttribute(product.custom_attributes, 'washing_description', false),
		condition,
		material: getCustomAttribute(product.custom_attributes, 'material', false),
		image: product.media_gallery_entries.length > 0 ? product.media_gallery_entries[0].file : '',
		images: product.media_gallery_entries.map(galleryEntry => galleryEntry.file),
		productConfigurationIds: product.extension_attributes.configurable_product_links.map(id => id.toString()),
		relatedProductSkus: product.product_links
			.filter(link => link.link_type === 'related' && link.linked_product_type === 'configurable')
			.map(link => link.linked_product_sku),
		categoryIds: product.extension_attributes.category_links.map(link => link.category_id),
	};
}

async function transformProductConfiguration(configuration: MagentoFullProduct): Promise<ProductConfiguration> {
	const colorsValue = getCustomAttribute(configuration.custom_attributes, 'color');
	const colors = colorsValue.split(',').filter(color => color.trim() !== '');

	const sizeValue = getCustomAttribute(configuration.custom_attributes, 'size', true);
	const size = await attributeValueToLabel('size', sizeValue);

	return {
		__type: 'SimpleProduct',
		id: configuration.id.toString(),
		sku: configuration.sku,
		enabled: configuration.status === 1,
		name: configuration.name,
		price: {
			originalPrice: configuration.price,
			specialPrice:
				parseFloat(getCustomAttribute(configuration.custom_attributes, 'special_price', false)) || configuration.price,
			currency: 'SEK',
		},
		colors,
		size,
	};
}

function transformProduct(product: MagentoFullProduct): Promise<Product> {
	switch (product.type_id) {
		case 'configurable':
			return transformConfigurableProduct(product);
		case 'simple':
			return transformProductConfiguration(product);
		default:
			throw new Error('Invalid product type: ' + product.type_id);
	}
}

export async function getProducts({ page = 1, pageSize = 10 }) {
	const query = {
		'searchCriteria[currentPage]': page,
		'searchCriteria[pageSize]': pageSize,
	};
	const { data } = await magentoAdminRequester.get<{ items: MagentoFullProduct[] }>(
		'/rest/default/V1/products?' + stringify(query),
	);
	const products = data.items.filter(p => ['configurable', 'simple'].includes(p.type_id));

	return Promise.all(products.map(product => transformProduct(product)));
}
