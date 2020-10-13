import { graphql } from 'relay-runtime';

import { appQuery } from './__generated__/appQuery.graphql';

export const APP_QUERY = graphql`
	query appQuery {
		viewer {
			...authContext_viewer
		}
	}
`;

export type { appQuery as AppQuery };
