import { graphql } from 'relay-runtime';

import { productQuery } from './__generated__/productQuery.graphql';

export const PRODUCT_QUERY = graphql`
	query productQuery($where: ProductWhereUniqueInput!) {
		product(where: $where) {
			id
		}
	}
`;

export type { productQuery as ProductQuery };
