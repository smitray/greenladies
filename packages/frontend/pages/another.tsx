import React from 'react';

import { ApolloClient, gql } from '@apollo/client';
import Link from 'next/link';

const AnotherPage = ({ test }) => {
	return (
		<div>
			<Link href="/">
				<a>To index</a>
			</Link>
			{test.id}: {test.name}
		</div>
	);
};

AnotherPage.getInitialProps = async context => {
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

export default AnotherPage;
