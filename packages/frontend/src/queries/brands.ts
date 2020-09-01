import { graphql } from 'relay-runtime';

import { brandsQuery } from './__generated__/brandsQuery.graphql';

export const BRANDS_QUERY = graphql`
	query brandsQuery {
		brands
	}
`;

export type { brandsQuery as BrandsQuery };
