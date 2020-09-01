import { graphql } from 'relay-runtime';

import { homeQuery } from './__generated__/homeQuery.graphql';

export const HOME_QUERY = graphql`
	query homeQuery {
		category(where: { urlKey: "klader" }) {
			id
			products {
				...ProductCarousel_products
			}
		}
	}
`;

export type { homeQuery as HomeQuery };
