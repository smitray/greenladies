import { graphql } from 'relay-runtime';

import { categoryQuery } from './__generated__/categoryQuery.graphql';

export const CATEGORY_QUERY = graphql`
	query categoryQuery($where: CategoryWhereUniqueInput!) {
		category(where: $where) {
			id
			...CategorySidebar_category
			...ProductList_category
		}
		wishlist {
			...Wishlist_wishlist
		}
	}
`;

export type { categoryQuery as CategoryQuery };
