import { graphql } from 'relay-runtime';

import { specialCategoryQuery } from './__generated__/specialCategoryQuery.graphql';

export const SPECIAL_CATEGORY_QUERY = graphql`
	query specialCategoryQuery(
		$where: CategoryWhereUniqueInput!
		$orderBy: OrderProductsInput
		$filters: ProductFiltersInput
	) {
		specialCategory(where: $where) {
			id
			name
			urlKey
			products(orderBy: $orderBy, filters: $filters) {
				...ProductFilters_products
				...ProductsWithFilters_products @arguments(filters: $filters)
			}
		}
		rootCategories {
			id
			name
			urlKey
			categoryProducts: products(filters: $filters) {
				totalCount
			}
		}
	}
`;

export type { specialCategoryQuery as SpecialCategoryQuery };