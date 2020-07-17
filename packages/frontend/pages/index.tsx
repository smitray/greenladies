import React from 'react';

import { ApolloClient, gql, useQuery } from '@apollo/client';
import Link from 'next/link';

const IndexPage = ({ test }) => {
	return (
		<div>
			<Link href="/another">
				<a>To another</a>
			</Link>
			{test.id}: {test.name}
		</div>
	);
};

IndexPage.getInitialProps = async context => {
	// console.log('index', context);

	const apolloClient: ApolloClient<any> = context.apolloClient;

	const { data } = await apolloClient.query({
		query: gql`
			query T {
				test {
					id
					name
				}
			}
		`,
	});

	console.log('object', data);

	return {
		test: data.test,
	};
};

export default IndexPage;
