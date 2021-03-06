import { graphql } from 'relay-runtime';

import { appQuery } from './__generated__/appQuery.graphql';

export const APP_QUERY = graphql`
	query appQuery {
		...Footer_query
		megamenu {
			...Navbar_megamenu
		}
		...Navbar_query
	}
`;

export type { appQuery as AppQuery };
