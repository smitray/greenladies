import { graphql } from 'relay-runtime';

import { checkoutQuery } from './__generated__/checkoutQuery.graphql';

export const CHECKOUT_QUERY = graphql`
	query checkoutQuery {
		shoppingCart {
			items {
				edges {
					node {
						amount
						product {
							specialPrice
						}
					}
				}
			}
			klarnaCartSnippet
			grandTotal
			subTotal
			discountAmount
			shippingCost
		}
	}
`;

export type { checkoutQuery as CheckoutQuery };
