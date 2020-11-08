import { graphql } from 'relay-runtime';

import { cartQuery } from './__generated__/cartQuery.graphql';

export const CART_QUERY = graphql`
	query cartQuery {
		shoppingCart {
			id
			items(first: 1000) @connection(key: "ShoppingCart_items") {
				edges {
					node {
						id
						amount
						product {
							id
							name
							originalPrice
							specialPrice
							size
							quantity
							parent {
								brand
								image
							}
						}
					}
				}
				totalCount
			}
			grandTotal
			subTotal
			discountAmount
			shippingCost
		}
	}
`;

export type { cartQuery as CartQuery };
