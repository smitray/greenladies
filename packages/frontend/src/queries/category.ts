import { Environment, fetchQuery, graphql } from 'relay-runtime';

import { categoryQuery, categoryQueryResponse, categoryQueryVariables } from './__generated__/categoryQuery.graphql';

const QUERY = graphql`
	query categoryQuery($where: CategoryWhereUniqueInput!) {
		category(where: $where) {
			id
		}
	}
`;

export function fetchCategoryQuery(relayEnvironment: Environment, variables: categoryQueryVariables) {
	return fetchQuery<categoryQuery>(relayEnvironment, QUERY, variables);
}

export type { categoryQueryResponse };
