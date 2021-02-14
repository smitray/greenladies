import { graphql } from 'relay-runtime';

import { customPagesQuery } from './__generated__/customPagesQuery.graphql';

export const CUSTOM_PAGES = graphql`
	query customPagesQuery {
		customPages {
		}
	}
`;

export type { customPagesQuery as CustomPagesQuery };
