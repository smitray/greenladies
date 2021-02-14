import { graphql } from 'relay-runtime';

import { customPagesQuery } from './__generated__/customPagesQuery.graphql';

export const CUSTOM_PAGES = graphql`
	query customPagesQuery {
		customPages {
			id
			path
			metaTitle
		}
	}
`;

export type { customPagesQuery as CustomPagesQuery };
