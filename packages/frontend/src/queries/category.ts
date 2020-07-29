import { graphql } from 'relay-runtime';

import { categoryQuery } from './__generated__/categoryQuery.graphql';

export const CATEGORY_QUERY = graphql`
	query categoryQuery($where: CategoryWhereUniqueInput!) {
		category(where: $where) {
			id
			...CategorySidebar_category
		}
	}
`;

export type { categoryQuery as CategoryQuery };
