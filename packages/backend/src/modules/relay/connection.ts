import gql from 'graphql-tag';

export function createConnectionTypes(name: string, extraConnectionFields: string[] = []) {
	return gql`
		type ${name}Connection {
			totalCount: Int!
			pageInfo: PageInfo!
			edges: [${name}Edge!]!
			${extraConnectionFields.join('\n')}
		}

		type ${name}Edge {
			node: ${name}!
			cursor: String!
		}
	`;
}
