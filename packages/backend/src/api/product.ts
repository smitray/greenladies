import { stringify } from 'query-string';

import { instance } from './util';

interface MagentoSimpleProduct {
	sku: string;
	position: number;
	category_id: string;
	extension_attributes: Record<string, any>;
}

export async function getProductsByCategoryId(categoryId: number) {
	const { data } = await instance.get('/rest/default/V1/categories/' + categoryId + '/products');

	const products = data as MagentoSimpleProduct[];

	return Promise.all(products.map(product => getProductBySku(product.sku)));
}

export interface MagentoFullProduct {
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

export async function getProducts({ page = 1, pageSize = 10 }) {
	const query = {
		'searchCriteria[currentPage]': page,
		'searchCriteria[pageSize]': pageSize,
	};
	const { data } = await instance.get('/rest/default/V1/products?' + stringify(query));

	return data.items as MagentoFullProduct[];
}

async function getProductBySku(sku: string) {
	const { data } = await instance.get('/rest/default/V1/products/' + sku);

	return data as MagentoFullProduct;
}
