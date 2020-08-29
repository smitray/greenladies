import { stringify } from 'query-string';

import { magentoAdminRequester } from './util';

export async function getProductsByCategoryId(categoryId: string) {
	const { data: products } = await magentoAdminRequester.get<{ sku: string }[]>(
		'/rest/default/V1/categories/' + categoryId + '/products',
	);

	return Promise.all(products.map(product => getProductBySku(product.sku)));
}

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
	attribute_set_id: number;
	price: number;
	status: number;
	visibility: number;
	type_id: string;
	created_at: string;
	updated_at: string;
	weight: number;
	extension_attributes: {
		website_ids: number[];
		category_links: {
			position: number;
			category_id: string;
			extension_attributes: Record<string, any>;
		}[];
		stock_item: {
			item_id: number;
			product_id: number;
			stock_id: number;
			qty: number;
			is_in_stock: boolean;
			is_qty_decimal: boolean;
			show_default_notification_message: boolean;
			use_config_min_qty: boolean;
			min_qty: number;
			use_config_min_sale_qty: number;
			min_sale_qty: number;
			use_config_max_sale_qty: boolean;
			max_sale_qty: number;
			use_config_backorders: boolean;
			backorders: number;
			use_config_notify_stock_qty: boolean;
			notify_stock_qty: number;
			use_config_qty_increments: boolean;
			qty_increments: number;
			use_config_enable_qty_inc: boolean;
			enable_qty_increments: boolean;
			use_config_manage_stock: boolean;
			manage_stock: boolean;
			low_stock_date: string;
			is_decimal_divided: boolean;
			stock_status_changed_auto: number;
			extension_attributes: Record<string, any>;
		};
		bundle_product_options: {
			option_id: number;
			title: string;
			required: boolean;
			type: string;
			position: number;
			sku: string;
			product_links: {
				id: string;
				sku: string;
				option_id: number;
				qty: number;
				position: number;
				is_default: boolean;
				price: number;
				price_type: number;
				can_change_quantity: number;
				extension_attributes: Record<string, any>;
			}[];
			extension_attributes: Record<string, any>;
		}[];
		configurable_product_options: {
			id: number;
			attribute_id: string;
			label: string;
			position: number;
			is_use_default: boolean;
			values: {
				value_index: number;
				extension_attributes: Record<string, any>;
			}[];
			extension_attributes: Record<string, any>;
			product_id: number;
		}[];
		configurable_product_links: number[];
		downloadable_product_links: {
			id: number;
			title: string;
			sort_order: number;
			is_shareable: number;
			price: number;
			number_of_downloads: number;
			link_type: string;
			link_file: string;
			link_file_content: {
				file_data: string;
				name: string;
				extension_attributes: Record<string, any>;
			};
			link_url: string;
			sample_type: string;
			sample_file: string;
			sample_file_content: {
				file_data: string;
				name: string;
				extension_attributes: Record<string, any>;
			};
			sample_url: string;
			extension_attributes: Record<string, any>;
		}[];
		downloadable_product_samples: {
			id: number;
			title: string;
			sort_order: number;
			sample_type: string;
			sample_file: string;
			sample_file_content: {
				file_data: string;
				name: string;
				extension_attributes: Record<string, any>;
			};
			sample_url: string;
			extension_attributes: Record<string, any>;
		}[];
		giftcard_amounts: {
			attribute_id: number;
			website_id: number;
			value: number;
			website_value: number;
			extension_attributes: Record<string, any>;
		}[];
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
	options: {
		product_sku: string;
		option_id: number;
		title: string;
		type: string;
		sort_order: number;
		is_require: boolean;
		price: number;
		price_type: string;
		sku: string;
		file_extension: string;
		max_characters: number;
		image_size_x: number;
		image_size_y: number;
		values: {
			title: string;
			sort_order: number;
			price: number;
			price_type: string;
			sku: string;
			option_type_id: number;
		}[];
		extension_attributes: {
			vertex_flex_field: string;
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
	tier_prices: {
		customer_group_id: number;
		qty: number;
		value: number;
		extension_attributes: {
			percentage_value: number;
			website_id: number;
		};
	}[];
	custom_attributes: {
		attribute_code: string;
		value: string;
	}[];
}

interface ConfigurableProductConfiguration {
	id: number;
	sku: string;
	name: string;
	attribute_set_id: number;
	price: number;
	status: number;
	visibility: number;
	type_id: string;
	created_at: string;
	updated_at: string;
	weight: number;
	extension_attributes: {
		website_ids: number[];
		category_links: {
			position: number;
			category_id: string;
			extension_attributes: Record<string, any>;
		}[];
		stock_item: {
			item_id: number;
			product_id: number;
			stock_id: number;
			qty: number;
			is_in_stock: true;
			is_qty_decimal: true;
			show_default_notification_message: true;
			use_config_min_qty: true;
			min_qty: number;
			use_config_min_sale_qty: number;
			min_sale_qty: number;
			use_config_max_sale_qty: true;
			max_sale_qty: number;
			use_config_backorders: true;
			backorders: number;
			use_config_notify_stock_qty: true;
			notify_stock_qty: number;
			use_config_qty_increments: true;
			qty_increments: number;
			use_config_enable_qty_inc: true;
			enable_qty_increments: true;
			use_config_manage_stock: true;
			manage_stock: true;
			low_stock_date: string;
			is_decimal_divided: true;
			stock_status_changed_auto: number;
			extension_attributes: Record<string, any>;
		};
		bundle_product_options: {
			option_id: number;
			title: string;
			required: true;
			type: string;
			position: number;
			sku: string;
			product_links: {
				id: string;
				sku: string;
				option_id: number;
				qty: number;
				position: number;
				is_default: true;
				price: number;
				price_type: number;
				can_change_quantity: number;
				extension_attributes: Record<string, any>;
			}[];
			extension_attributes: Record<string, any>;
		}[];
		configurable_product_options: {
			id: number;
			attribute_id: string;
			label: string;
			position: number;
			is_use_default: true;
			values: {
				value_index: number;
				extension_attributes: Record<string, any>;
			}[];
			extension_attributes: Record<string, any>;
			product_id: number;
		}[];
		configurable_product_links: number[];
		downloadable_product_links: {
			id: number;
			title: string;
			sort_order: number;
			is_shareable: number;
			price: number;
			number_of_downloads: number;
			link_type: string;
			link_file: string;
			link_file_content: {
				file_data: string;
				name: string;
				extension_attributes: Record<string, any>;
			};
			link_url: string;
			sample_type: string;
			sample_file: string;
			sample_file_content: {
				file_data: string;
				name: string;
				extension_attributes: Record<string, any>;
			};
			sample_url: string;
			extension_attributes: Record<string, any>;
		}[];
		downloadable_product_samples: {
			id: number;
			title: string;
			sort_order: number;
			sample_type: string;
			sample_file: string;
			sample_file_content: {
				file_data: string;
				name: string;
				extension_attributes: Record<string, any>;
			};
			sample_url: string;
			extension_attributes: Record<string, any>;
		}[];
		giftcard_amounts: {
			attribute_id: number;
			website_id: number;
			value: number;
			website_value: number;
			extension_attributes: Record<string, any>;
		}[];
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
	options: {
		product_sku: string;
		option_id: number;
		title: string;
		type: string;
		sort_order: number;
		is_require: true;
		price: number;
		price_type: string;
		sku: string;
		file_extension: string;
		max_characters: number;
		image_size_x: number;
		image_size_y: number;
		values: {
			title: string;
			sort_order: number;
			price: number;
			price_type: string;
			sku: string;
			option_type_id: number;
		}[];
		extension_attributes: {
			vertex_flex_field: string;
		};
	}[];
	media_gallery_entries: {
		id: number;
		media_type: string;
		label: string;
		position: number;
		disabled: true;
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
	tier_prices: {
		customer_group_id: number;
		qty: number;
		value: number;
		extension_attributes: {
			percentage_value: number;
			website_id: number;
		};
	}[];
	custom_attributes: {
		attribute_code: string;
		value: string;
	}[];
}

export async function getConfigurableProductVirtualProducts(sku: string) {
	const { data: products } = await magentoAdminRequester.get<ConfigurableProductConfiguration[]>(
		`/rest/default/V1/configurable-products/${sku}/children`,
	);

	return Promise.all(products.map(({ sku }) => getProductBySku(sku)));
}

export async function getRelatedProducts(sku: string): Promise<ConfigurableProduct[]> {
	const { data } = await magentoAdminRequester.get<{ linked_product_sku: string; linked_product_type: string }[]>(
		`/rest/default/V1/products/${sku}/links/related`,
	);

	return Promise.all(
		data
			.filter(({ linked_product_type }) => linked_product_type === 'configurable')
			.map(({ linked_product_sku }) => getProductBySku(linked_product_sku)),
	).then(products =>
		products.map(product => {
			if (product.__type === 'ConfigurableProduct') {
				return product;
			}

			throw new Error('This will never happen');
		}),
	);
}

async function attributeValueToLabel(attributeCode: string, value: string) {
	const options = await attributeOptions(attributeCode);
	const option = options.find(option => option.value === value);
	if (!option) {
		throw new Error('Invalid option, this should not happen');
	}

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

interface MagentoStockItem {
	item_id: number;
	product_id: number;
	stock_id: number;
	qty: number;
	is_in_stock: boolean;
	is_qty_decimal: boolean;
	show_default_notification_message: boolean;
	use_config_min_qty: boolean;
	min_qty: number;
	use_config_min_sale_qty: number;
	min_sale_qty: number;
	use_config_max_sale_qty: boolean;
	max_sale_qty: number;
	use_config_backorders: boolean;
	backorders: number;
	use_config_notify_stock_qty: boolean;
	notify_stock_qty: number;
	use_config_qty_increments: boolean;
	qty_increments: number;
	use_config_enable_qty_inc: boolean;
	enable_qty_increments: boolean;
	use_config_manage_stock: boolean;
	manage_stock: boolean;
	low_stock_date: string;
	is_decimal_divided: boolean;
	stock_status_changed_auto: number;
	extension_attributes: Record<string, any>;
}

async function getProductStock(sku: string) {
	const { data } = await magentoAdminRequester.get<MagentoStockItem>(`/rest/default/V1/stockItems/${sku}`);

	return data;
}

export interface ConfigurableProduct {
	__type: 'ConfigurableProduct';
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
	image: string;
	images: string[];
	configurationAttributes: string[];
	virtualProductIds: string[];
}

export interface VirtualProduct {
	__type: 'VirtualProduct';
	id: string;
	sku: string;
	name: string;
	brand: string;
	quantity: number;
	price: {
		originalPrice: number;
		specialPrice: number;
		currency: string;
	};
	colors: string[];
	size: string;
}

export type Product = ConfigurableProduct | VirtualProduct;

async function transformConfigurableProduct(product: MagentoFullProduct): Promise<ConfigurableProduct> {
	const virtualProducts = await getConfigurableProductVirtualProducts(product.sku);
	const brandAttribute = getCustomAttribute(product.custom_attributes, 'mgs_brand', true);
	const brand = await attributeValueToLabel('mgs_brand', brandAttribute);

	return {
		__type: 'ConfigurableProduct',
		id: product.id.toString(),
		sku: product.sku,
		urlKey: getCustomAttribute(product.custom_attributes, 'url_key', true),
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
		image: product.media_gallery_entries.length > 0 ? product.media_gallery_entries[0].file : '',
		images: product.media_gallery_entries.map(galleryEntry => galleryEntry.file),
		configurationAttributes: ['size'],
		virtualProductIds: virtualProducts.map(virtualProduct => virtualProduct.id.toString()),
	};
}

async function transformVirtualProduct(product: MagentoFullProduct): Promise<VirtualProduct> {
	const colorsValue = getCustomAttribute(product.custom_attributes, 'color');
	const colors = await Promise.all(
		colorsValue
			.split('|')
			.filter(x => x.trim() !== '')
			.map(colorValue => attributeValueToLabel('color', colorValue)),
	);

	const sizeValue = getCustomAttribute(product.custom_attributes, 'size', false);
	const size = sizeValue === '' ? '' : await attributeValueToLabel('size', sizeValue);

	const stock = await getProductStock(product.sku);

	const brandAttribute = getCustomAttribute(product.custom_attributes, 'mgs_brand', true);
	const brand = await attributeValueToLabel('mgs_brand', brandAttribute);

	return {
		__type: 'VirtualProduct',
		id: product.id.toString(),
		sku: product.sku,
		name: product.name,
		brand,
		quantity: stock.qty,
		price: {
			originalPrice: product.price,
			specialPrice: parseFloat(getCustomAttribute(product.custom_attributes, 'special_price', false)) || product.price,
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
		case 'virtual':
			return transformVirtualProduct(product);
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
	const products = data.items.filter(p => ['configurable', 'virtual'].includes(p.type_id));

	return Promise.all(products.map(product => transformProduct(product)));
}

async function getProductBySku(sku: string) {
	const { data: product } = await magentoAdminRequester.get<MagentoFullProduct>('/rest/default/V1/products/' + sku);

	return transformProduct(product);
}
