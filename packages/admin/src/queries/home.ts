import { graphql } from 'relay-runtime';

import { homeQuery } from './__generated__/homeQuery.graphql';

export const HOME_QUERY = graphql`
	query homeQuery {
		products {
			edges {
				node {
					id
					sku
				}
			}
		}
	}
`;

export type { homeQuery as HomeQuery };
