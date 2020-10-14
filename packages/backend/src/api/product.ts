import { stringify } from 'query-string';

import { getCategory } from '../magento-sync';

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

const attributeValueToLabelCache = new Map<string, { insertedAt: Date; options: Map<string, string> }>();

const ATTRIBUTE_VALUE_TO_LABEL_CACHE_TIME = 1000 * 60 * 15; // 15 minutes

async function attributeValueToLabel(attributeCode: string, value: string) {
	const cacheEntry = attributeValueToLabelCache.get(attributeCode);
	if (cacheEntry && new Date(cacheEntry.insertedAt.getTime() + ATTRIBUTE_VALUE_TO_LABEL_CACHE_TIME) > new Date()) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return cacheEntry.options.get(value)!;
	}

	const rawOptions = await attributeOptions(attributeCode);
	const options = new Map(rawOptions.filter(option => option.label !== ' ').map(value => [value.value, value.label]));
	const option = options.get(value);
	if (!option) {
		throw new Error('Invalid option, this should not happen');
	}

	attributeValueToLabelCache.set(attributeCode, {
		insertedAt: new Date(),
		options: options,
	});

	return option;
}

function getCustomAttribute(
	productId: number,
	customAttributes: { attribute_code: string; value: string }[],
	code: string,
	required = true,
) {
	const attribute = customAttributes.find(attribute => attribute.attribute_code === code);
	if (!attribute) {
		if (!required) {
			return '';
		}

		throw new Error(`Invalid product ${productId}, must have ${code} attribute`);
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
	const brandAttribute = getCustomAttribute(product.id, product.custom_attributes, 'mgs_brand', true);
	const brand = await attributeValueToLabel('mgs_brand', brandAttribute);

	const conditionAttribute = getCustomAttribute(product.id, product.custom_attributes, 'condition', true);
	const condition = await attributeValueToLabel('condition', conditionAttribute);

	return {
		__type: 'ConfigurableProduct',
		id: product.id.toString(),
		sku: product.sku,
		urlKey: getCustomAttribute(product.id, product.custom_attributes, 'url_key', true),
		enabled: product.status === 1,
		name: product.name,
		brand,
		metaData: {
			title: getCustomAttribute(product.id, product.custom_attributes, 'meta_title', false),
			keyword: getCustomAttribute(product.id, product.custom_attributes, 'meta_keyword', false),
			description: getCustomAttribute(product.id, product.custom_attributes, 'meta_description', false),
		},
		description: {
			short: getCustomAttribute(product.id, product.custom_attributes, 'short_description', false),
			full: getCustomAttribute(product.id, product.custom_attributes, 'description'),
		},
		washingDescription: getCustomAttribute(product.id, product.custom_attributes, 'washing_description', false),
		condition,
		material: getCustomAttribute(product.id, product.custom_attributes, 'material', false),
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
	const colorsValue = getCustomAttribute(configuration.id, configuration.custom_attributes, 'color');
	const colors = colorsValue.split(',').filter(color => color.trim() !== '');

	const sizeValue = getCustomAttribute(configuration.id, configuration.custom_attributes, 'size', true);
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
				parseFloat(getCustomAttribute(configuration.id, configuration.custom_attributes, 'special_price', false)) ||
				configuration.price,
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

	const products = data.items.filter(p => p.status === 1).filter(p => ['configurable', 'simple'].includes(p.type_id));

	return Promise.all(products.map(product => transformProduct(product)));
}

/* ----------------------------------------------- */

interface CreateConfigurableProductInput {
	name: string;
	sku: string;
	attributeSetId: string;
	categoryIds: string[];
	description: string;
	shortDescription: string;
	washingDescription: string;
	material: string;
	urlKey: string;
	metaTitle: string;
	metaKeywords: string;
	metaDescription: string;
	color: string;
	brandValue: string;
	conditionValue: string;
	enabled: boolean;
}

async function createConfigurableProduct({
	name,
	sku,
	attributeSetId,
	categoryIds,
	description,
	shortDescription,
	washingDescription,
	material,
	urlKey,
	metaTitle,
	metaKeywords,
	metaDescription,
	color,
	brandValue,
	conditionValue,
	enabled,
}: CreateConfigurableProductInput) {
	await magentoAdminRequester.post('/rest/default/V1/products', {
		product: {
			sku,
			name,
			attribute_set_id: attributeSetId,
			status: enabled ? 1 : 0,
			visibility: 4,
			type_id: 'configurable',
			extension_attributes: {
				category_links: categoryIds.map((id, index) => ({ position: index, category_id: id })),
			},
			custom_attributes: [
				{ attribute_code: 'description', value: description },
				{ attribute_code: 'short_description', value: shortDescription },
				{ attribute_code: 'washing_description', value: washingDescription },
				{ attribute_code: 'material', value: material },
				{ attribute_code: 'url_key', value: urlKey },
				{ attribute_code: 'meta_title', value: metaTitle },
				{ attribute_code: 'meta_keyword', value: metaKeywords },
				{ attribute_code: 'meta_description', value: metaDescription },
				{ attribute_code: 'color', value: color },
				{ attribute_code: 'mgs_brand', value: brandValue },
				{ attribute_code: 'condition', value: conditionValue },
			],
		},
	});
}

interface CreateSimpleProductInput {
	name: string;
	sku: string;
	attributeSetId: string;
	price: number;
	categoryIds: string[];
	quantity: number;
	color: string;
	brandValue: string;
	conditionValue: string;
	sizeValue: string;
	urlKey: string;
	enabled: boolean;
}

async function createSimpleProduct({
	name,
	sku,
	attributeSetId,
	price,
	categoryIds,
	quantity,
	color,
	brandValue,
	conditionValue,
	sizeValue,
	urlKey,
	enabled,
}: CreateSimpleProductInput) {
	await magentoAdminRequester.post('/rest/default/V1/products', {
		product: {
			sku,
			name,
			attribute_set_id: attributeSetId,
			price: price,
			status: enabled ? 1 : 0,
			visibility: 4,
			type_id: 'simple',
			extension_attributes: {
				category_links: categoryIds.map((id, index) => ({ position: index, category_id: id })),
				stock_item: {
					qty: quantity,
					is_in_stock: true,
				},
			},
			custom_attributes: [
				{
					attribute_code: 'color',
					value: color,
				},
				{
					attribute_code: 'mgs_brand',
					value: brandValue,
				},
				{
					attribute_code: 'condition',
					value: conditionValue,
				},
				{ attribute_code: 'size', value: sizeValue },
				{ attribute_code: 'url_key', value: urlKey },
			],
		},
	});
}

async function setConfigurableAttribute(sku: string, attributeId: string) {
	await magentoAdminRequester.post(`/rest/default/V1/configurable-products/${sku}/options`, {
		option: {
			attribute_id: attributeId,
			label: 'Size',
			values: [
				{
					value_index: 9,
				},
			],
		},
	});
}

async function linkSimpleProductToConfigurableProduct(configurableProductSku: string, simpleProductSku: string) {
	await magentoAdminRequester.post(`/rest/default/V1/configurable-products/${configurableProductSku}/child`, {
		childSku: simpleProductSku,
	});
}

async function getAttributeSetIdByName(attributeSetName: string) {
	const query = {
		'searchCriteria[filter_groups][0][filters][0][field]': 'attribute_set_name',
		'searchCriteria[filter_groups][0][filters][0][value]': attributeSetName,
		'searchCriteria[filter_groups][0][filters][0][condition_type]': 'eq',
	};
	const { data: attributeSetSearchData } = await magentoAdminRequester.get<{ items: { attribute_set_id: string }[] }>(
		'/rest/default/V1/eav/attribute-sets/list?' + stringify(query),
	);

	if (attributeSetSearchData.items.length === 0) {
		throw new Error('Attribute set Green Ladies not found');
	}

	return attributeSetSearchData.items[0].attribute_set_id;
}

async function getAttributeSetAttributes(attributeSetId: string) {
	const { data } = await magentoAdminRequester.get<
		{
			attribute_id: string;
			attribute_code: string;
			options: { label: string; value: string }[];
		}[]
	>('/rest/default/V1/products/attribute-sets/' + attributeSetId + '/attributes');

	return data;
}

interface CreateProductInput {
	name: string;
	baseSku: string;
	categoryId: string;
	description: string;
	shortDescription: string;
	washingDescription: string;
	material: string;
	urlKey: string;
	metaTitle: string;
	metaKeywords: string;
	metaDescription: string;
	color: string;
	brand: string;
	condition: string;
	configurations: {
		size: string;
		price: number;
		quantity: number;
	}[];
	enabled: boolean;
}

export async function createProduct({
	name,
	baseSku,
	categoryId,
	description,
	shortDescription,
	washingDescription,
	material,
	urlKey,
	metaTitle,
	metaKeywords,
	metaDescription,
	color,
	brand,
	condition,
	configurations,
	enabled,
}: CreateProductInput) {
	const attributeSetId = await getAttributeSetIdByName('Green Ladies');

	const attributes = await getAttributeSetAttributes(attributeSetId);

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const brandValue = attributes
		.find(attribute => attribute.attribute_code === 'mgs_brand')!
		.options.find(option => option.label === brand)?.value;
	if (!brandValue) {
		throw new Error('Invalid brand: ' + brand);
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const conditionValue = attributes
		.find(attribute => attribute.attribute_code === 'condition')!
		.options.find(option => option.label === condition.toLowerCase())?.value;
	if (!conditionValue) {
		throw new Error('Invalid condition: ' + condition);
	}

	// Fetch all parent categories
	const categoryIds: string[] = [];
	let currentCategoryId = categoryId;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		categoryIds.push(currentCategoryId);
		const category = await getCategory({ id: currentCategoryId });
		if (category.parentId === '2') {
			break;
		}

		currentCategoryId = category.parentId;
	}

	await createConfigurableProduct({
		name,
		sku: baseSku + '-CONF',
		attributeSetId,
		categoryIds,
		description,
		shortDescription,
		washingDescription,
		material,
		urlKey,
		metaTitle,
		metaKeywords,
		metaDescription,
		color,
		brandValue,
		conditionValue,
		enabled,
	});

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const sizeAttribute = attributes.find(attribute => attribute.attribute_code === 'size')!;

	await setConfigurableAttribute(baseSku + '-CONF', sizeAttribute.attribute_id);

	const configurationsWithSizeValues = configurations.map(configuration => {
		const option = sizeAttribute.options.find(option => option.label === configuration.size);
		if (!option) {
			throw new Error('Invalid size: ' + configuration.size);
		}

		return {
			...configuration,
			sizeValue: option.value,
		};
	});

	for (const configuration of configurationsWithSizeValues) {
		await createSimpleProduct({
			name,
			sku: baseSku + '-' + configuration.size,
			attributeSetId,
			price: configuration.price,
			categoryIds,
			quantity: configuration.quantity,
			color,
			brandValue,
			conditionValue,
			sizeValue: configuration.sizeValue,
			urlKey: urlKey + '-' + configuration.size,
			enabled,
		});
		await linkSimpleProductToConfigurableProduct(baseSku + '-CONF', baseSku + '-' + configuration.size);
	}
}
