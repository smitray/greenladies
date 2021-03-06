import { magentoGuestRequester } from './util';

export interface GuestShoppingCartItem {
	item_id: number;
	sku: string;
	qty: number;
	name: string;
	price: number;
	product_type: string;
	quote_id: string;
	product_option: {
		extension_attributes: {
			custom_options: {
				option_id: string;
				option_value: string;
				extension_attributes: {
					file_info: {
						base64_encoded_data: string;
						type: string;
						name: string;
					};
				};
			}[];
			bundle_options: {
				option_id: number;
				option_qty: number;
				option_selections: number[];
				extension_attributes: Record<string, any>;
			}[];
			configurable_item_options: {
				option_id: string;
				option_value: number;
				extension_attributes: Record<string, any>;
			}[];
			downloadable_option: {
				downloadable_links: number[];
			};
			giftcard_item_option: {
				giftcard_amount: string;
				custom_giftcard_amount: number;
				giftcard_sender_name: string;
				giftcard_recipient_name: string;
				giftcard_sender_email: string;
				giftcard_recipient_email: string;
				giftcard_message: string;
				extension_attributes: {
					giftcard_created_codes: string[];
				};
			};
		};
	};
	extension_attributes: {
		discounts: {
			discount_data: {
				amount: number;
				base_amount: number;
				original_amount: number;
				base_original_amount: number;
			};
			rule_label: string;
			rule_id: number;
		}[];
		negotiable_quote_item: {
			item_id: number;
			original_price: number;
			original_tax_amount: number;
			original_discount_amount: number;
			extension_attributes: Record<string, any>;
		};
	};
}

export interface GuestShoppingCart {
	id: number;
	created_at: string;
	updated_at: string;
	converted_at: string;
	is_active: true;
	is_virtual: true;
	items: GuestShoppingCartItem[];
	items_count: number;
	items_qty: number;
	customer: {
		id: number;
		group_id: number;
		default_billing: string;
		default_shipping: string;
		confirmation: string;
		created_at: string;
		updated_at: string;
		created_in: string;
		dob: string;
		email: string;
		firstname: string;
		lastname: string;
		middlename: string;
		prefix: string;
		suffix: string;
		gender: number;
		store_id: number;
		taxvat: string;
		website_id: number;
		addresses: {
			id: number;
			customer_id: number;
			region: {
				region_code: string;
				region: string;
				region_id: number;
				extension_attributes: Record<string, any>;
			};
			region_id: number;
			country_id: string;
			street: [string];
			company: string;
			telephone: string;
			fax: string;
			postcode: string;
			city: string;
			firstname: string;
			lastname: string;
			middlename: string;
			prefix: string;
			suffix: string;
			vat_id: string;
			default_shipping: true;
			default_billing: true;
			extension_attributes: Record<string, any>;
			custom_attributes: {
				attribute_code: string;
				value: string;
			}[];
		}[];
		disable_auto_group_change: number;
		extension_attributes: {
			company_attributes: {
				customer_id: number;
				company_id: number;
				job_title: string;
				status: number;
				telephone: string;
				extension_attributes: Record<string, any>;
			};
			is_subscribed: true;
			amazon_id: string;
			vertex_customer_code: string;
		};
		custom_attributes: {
			attribute_code: string;
			value: string;
		}[];
	};
	billing_address: {
		id: number;
		region: string;
		region_id: number;
		region_code: string;
		country_id: string;
		street: [string];
		company: string;
		telephone: string;
		fax: string;
		postcode: string;
		city: string;
		firstname: string;
		lastname: string;
		middlename: string;
		prefix: string;
		suffix: string;
		vat_id: string;
		customer_id: number;
		email: string;
		same_as_billing: number;
		customer_address_id: number;
		save_in_address_book: number;
		extension_attributes: {
			discounts: {
				discount_data: {
					amount: number;
					base_amount: number;
					original_amount: number;
					base_original_amount: number;
				};
				rule_label: string;
				rule_id: number;
			}[];
			gift_registry_id: number;
		};
		custom_attributes: {
			attribute_code: string;
			value: string;
		}[];
	};
	reserved_order_id: string;
	orig_order_id: number;
	currency: {
		global_currency_code: string;
		base_currency_code: string;
		store_currency_code: string;
		quote_currency_code: string;
		store_to_base_rate: number;
		store_to_quote_rate: number;
		base_to_global_rate: number;
		base_to_quote_rate: number;
		extension_attributes: Record<string, any>;
	};
	customer_is_guest: true;
	customer_note: string;
	customer_note_notify: true;
	customer_tax_class_id: number;
	store_id: number;
	extension_attributes: {
		shipping_assignments: {
			shipping: {
				address: {
					id: number;
					region: string;
					region_id: number;
					region_code: string;
					country_id: string;
					street: [string];
					company: string;
					telephone: string;
					fax: string;
					postcode: string;
					city: string;
					firstname: string;
					lastname: string;
					middlename: string;
					prefix: string;
					suffix: string;
					vat_id: string;
					customer_id: number;
					email: string;
					same_as_billing: number;
					customer_address_id: number;
					save_in_address_book: number;
					extension_attributes: {
						discounts: {
							discount_data: {
								amount: number;
								base_amount: number;
								original_amount: number;
								base_original_amount: number;
							};
							rule_label: string;
							rule_id: number;
						}[];
						gift_registry_id: number;
					};
					custom_attributes: {
						attribute_code: string;
						value: string;
					}[];
				};
				method: string;
				extension_attributes: Record<string, any>;
			};
			items: GuestShoppingCartItem[];
			extension_attributes: Record<string, any>;
		}[];
		negotiable_quote: {
			quote_id: number;
			is_regular_quote: true;
			status: string;
			negotiated_price_type: number;
			negotiated_price_value: number;
			shipping_price: number;
			quote_name: string;
			expiration_period: string;
			email_notification_status: number;
			has_unconfirmed_changes: true;
			is_shipping_tax_changed: true;
			is_customer_price_changed: true;
			notifications: number;
			applied_rule_ids: string;
			is_address_draft: true;
			deleted_sku: string;
			creator_id: number;
			creator_type: number;
			original_total_price: number;
			base_original_total_price: number;
			negotiated_total_price: number;
			base_negotiated_total_price: number;
			extension_attributes: Record<string, any>;
		};
		amazon_order_reference_id: {
			id: string;
			amazon_order_reference_id: string;
			quote_id: number;
			sandbox_simulation_reference: string;
			confirmed: true;
		};
	};
}

export async function getGuestShoppingCart(cartId: string) {
	const { data } = await magentoGuestRequester.get<GuestShoppingCart>('/rest/default/V1/guest-carts/' + cartId);

	return data;
}

export async function getGuestShoppingCartItems(cartId: string) {
	const { data } = await magentoGuestRequester.get<GuestShoppingCartItem[]>(
		'/rest/default/V1/guest-carts/' + cartId + '/items',
	);

	return data;
}

export async function createGuestShoppingCart() {
	const { data } = await magentoGuestRequester.post<string>('/rest/default/V1/guest-carts');

	return data;
}

interface GuestShoppingCartProudctAddedResult {
	item_id: number;
	sku: string;
	qty: number;
	name: string;
	price: number;
	product_type: string;
	quote_id: string;
	product_option: {
		extension_attributes: {
			custom_options: {
				option_id: string;
				option_value: string;
				extension_attributes: {
					file_info: {
						base64_encoded_data: string;
						type: string;
						name: string;
					};
				};
			}[];
			bundle_options: [
				{
					option_id: number;
					option_qty: number;
					option_selections: number[];
					extension_attributes: Record<string, any>;
				},
			];
			configurable_item_options: {
				option_id: string;
				option_value: number;
				extension_attributes: Record<string, any>;
			}[];
			downloadable_option: {
				downloadable_links: number[];
			};
			giftcard_item_option: {
				giftcard_amount: string;
				custom_giftcard_amount: number;
				giftcard_sender_name: string;
				giftcard_recipient_name: string;
				giftcard_sender_email: string;
				giftcard_recipient_email: string;
				giftcard_message: string;
				extension_attributes: {
					giftcard_created_codes: string[];
				};
			};
		};
	};
	extension_attributes: {
		discounts: {
			discount_data: {
				amount: number;
				base_amount: number;
				original_amount: number;
				base_original_amount: number;
			};
			rule_label: string;
			rule_id: number;
		}[];
		negotiable_quote_item: {
			item_id: number;
			original_price: number;
			original_tax_amount: number;
			original_discount_amount: number;
			extension_attributes: Record<string, any>;
		};
	};
}

export async function addProductToGuestShoppingCart({
	cartId,
	productSku,
	quantity,
}: {
	cartId: string;
	productSku: string;
	quantity: number;
}) {
	const { data } = await magentoGuestRequester.post<GuestShoppingCartProudctAddedResult>(
		`/rest/default/V1/guest-carts/${cartId}/items`,
		{
			cartItem: {
				qty: quantity,
				quote_id: cartId,
				sku: productSku,
			},
		},
	);

	return data;
}

export async function updateGuestShoppingCartProductQuantity({
	cartId,
	itemId,
	quantity,
}: {
	cartId: string;
	itemId: string;
	quantity: number;
}) {
	const { data } = await magentoGuestRequester.put<GuestShoppingCartProudctAddedResult>(
		`/rest/default/V1/guest-carts/${cartId}/items/${itemId}`,
		{
			cartItem: {
				qty: quantity,
				quote_id: cartId,
				// sku: productSku,
			},
		},
	);

	return data;
}

export async function deleteProductFromGuestShoppingCart({ cartId, itemId }: { cartId: string; itemId: string }) {
	const { data } = await magentoGuestRequester.delete<boolean>(
		`/rest/default/V1/guest-carts/${cartId}/items/${itemId}`,
	);

	return data;
}

export async function addCouponToShoppingCart({ cartId, code }: { cartId: string; code: string }) {
	const { data } = await magentoGuestRequester.put<boolean>(`/rest/default/V1/guest-carts/${cartId}/coupons/${code}`);

	return data;
}

interface GuestCartTotals {
	grand_total: number;
	base_grand_total: number;
	subtotal: number;
	base_subtotal: number;
	discount_amount: number;
	base_discount_amount: number;
	subtotal_with_discount: number;
	base_subtotal_with_discount: number;
	shipping_amount: number;
	base_shipping_amount: number;
	shipping_discount_amount: number;
	base_shipping_discount_amount: number;
	tax_amount: number;
	base_tax_amount: number;
	weee_tax_applied_amount: number;
	shipping_tax_amount: number;
	base_shipping_tax_amount: number;
	subtotal_incl_tax: number;
	base_subtotal_incl_tax: number;
	shipping_incl_tax: number;
	base_shipping_incl_tax: number;
	base_currency_code: string;
	quote_currency_code: string;
	coupon_code: string;
	items_qty: number;
	items: [
		{
			item_id: number;
			price: number;
			base_price: number;
			qty: number;
			row_total: number;
			base_row_total: number;
			row_total_with_discount: number;
			tax_amount: number;
			base_tax_amount: number;
			tax_percent: number;
			discount_amount: number;
			base_discount_amount: number;
			discount_percent: number;
			price_incl_tax: number;
			base_price_incl_tax: number;
			row_total_incl_tax: number;
			base_row_total_incl_tax: number;
			options: string;
			weee_tax_applied_amount: number;
			weee_tax_applied: string;
			extension_attributes: {
				negotiable_quote_item_totals: {
					cost: number;
					catalog_price: number;
					base_catalog_price: number;
					catalog_price_incl_tax: number;
					base_catalog_price_incl_tax: number;
					cart_price: number;
					base_cart_price: number;
					cart_tax: number;
					base_cart_tax: number;
					cart_price_incl_tax: number;
					base_cart_price_incl_tax: number;
					extension_attributes: any;
				};
			};
			name: string;
		},
	];
	total_segments: {
		code: string;
		title: string;
		value: number;
		area: string;
		extension_attributes: {
			tax_grandtotal_details: {
				amount: number;
				rates: [
					{
						percent: string;
						title: string;
					},
				];
				group_id: number;
			}[];
			gift_cards: string;
			gw_order_id: string;
			gw_item_ids: [string];
			gw_allow_gift_receipt: string;
			gw_add_card: string;
			gw_price: string;
			gw_base_price: string;
			gw_items_price: string;
			gw_items_base_price: string;
			gw_card_price: string;
			gw_card_base_price: string;
			gw_base_tax_amount: string;
			gw_tax_amount: string;
			gw_items_base_tax_amount: string;
			gw_items_tax_amount: string;
			gw_card_base_tax_amount: string;
			gw_card_tax_amount: string;
			gw_price_incl_tax: string;
			gw_base_price_incl_tax: string;
			gw_card_price_incl_tax: string;
			gw_card_base_price_incl_tax: string;
			gw_items_price_incl_tax: string;
			gw_items_base_price_incl_tax: string;
			vertex_tax_calculation_messages: string[];
		};
	}[];
	extension_attributes: {
		coupon_label: string;
		negotiable_quote_totals: {
			items_count: number;
			quote_status: string;
			created_at: string;
			updated_at: string;
			customer_group: number;
			base_to_quote_rate: number;
			cost_total: number;
			base_cost_total: number;
			original_total: number;
			base_original_total: number;
			original_tax: number;
			base_original_tax: number;
			original_price_incl_tax: number;
			base_original_price_incl_tax: number;
			negotiated_price_type: number;
			negotiated_price_value: number;
		};
		base_customer_balance_amount: number;
		customer_balance_amount: number;
		reward_points_balance: number;
		reward_currency_amount: number;
		base_reward_currency_amount: number;
	};
}

export async function getShoppingCartTotals({ cartId }: { cartId: string }) {
	const { data } = await magentoGuestRequester.get<GuestCartTotals>(`/rest/default/V1/guest-carts/${cartId}/totals`);

	return data;
}
