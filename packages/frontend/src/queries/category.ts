import { graphql } from 'relay-runtime';

import { categoryQuery } from './__generated__/categoryQuery.graphql';

export const CATEGORY_QUERY = graphql`
	query categoryQuery($where: CategoryWhereUniqueInput!, $orderBy: OrderProductsInput, $filters: ProductFiltersInput) {
		category(where: $where) {
			id
			name
			urlKey
			products(orderBy: $orderBy, filters: $filters) {
				...ProductFilters_products
				...ProductsWithFilters_products @arguments(filters: $filters)
			}
			...CategorySidebar_category @arguments(filters: $filters)
			...MobileCategoriesList_category @arguments(filters: $filters)
			metaTitle
			metaKeywords
			metaDescription
		}
	}
`;

export type { categoryQuery as CategoryQuery };
