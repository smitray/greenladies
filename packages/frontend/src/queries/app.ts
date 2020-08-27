import { graphql } from 'relay-runtime';

import { appQuery } from './__generated__/appQuery.graphql';

export const APP_QUERY = graphql`
	query appQuery {
		wishlist {
			...wishlistContext_wishlist
		}
		shoppingCart {
			...shoppingCartContext_cart
		}
	}
`;

export type { appQuery as AppQuery };
