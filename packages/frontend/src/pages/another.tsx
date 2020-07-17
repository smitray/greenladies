import React from 'react';

import { ApolloClient, gql } from '@apollo/client';
import Link from 'next/link';

import { MyNextPage } from '../lib/types';

import { anotherQuery } from './__generated__/anotherQuery';

interface Props {
	test: {
		id: string;
		name: string;
	};
}

const AnotherPage: MyNextPage<Props> = ({ test }) => {
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

	const { data } = await apolloClient.query<anotherQuery>({
		query: gql`
			query anotherQuery {
				test(name: "hehee") {
					id
					name
				}
			}
		`,
	});

	if (!data) {
		throw new Error("Couln't fetch data");
	}

	return {
		test: data.test,
	};
};

export default AnotherPage;
