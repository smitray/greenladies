import { graphql } from 'relay-runtime';

import { allCategoriesQuery } from './__generated__/allCategoriesQuery.graphql';

export const ALL_CATEGORIES_QUERY = graphql`
	query allCategoriesQuery($orderBy: OrderProductsInput, $filters: ProductFiltersInput) {
		...CategorySidebarRoot_query @arguments(filters: $filters)
		...MobileRootCategoriesList_query @arguments(filters: $filters)
		products(orderBy: $orderBy, filters: $filters) {
			...ProductFilters_products
			...ProductsWithFilters_products @arguments(filters: $filters)
		}
	}
`;

export type { allCategoriesQuery as AllCategoriesQuery };
