import { gql } from '@apollo/client';

export const PAGE_QUERY = gql`
	query PageQuery {
		test {
			id
			name
		}
	}
`;
