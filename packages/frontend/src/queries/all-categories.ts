import { graphql } from 'relay-runtime';

import { allCategoriesQuery } from './__generated__/allCategoriesQuery.graphql';

export const ALL_CATEGORIES_QUERY = graphql`
	query allCategoriesQuery($orderBy: OrderProductsInput, $filters: ProductFiltersInput) {
		rootCategories {
			id
			name
			urlKey
			categoryProducts: products(filters: $filters) {
				totalCount
			}
		}
		products(orderBy: $orderBy, filters: $filters) {
			...ProductFilters_products
			...ProductsWithFilters_products @arguments(filters: $filters)
		}
	}
`;

export type { allCategoriesQuery as AllCategoriesQuery };
