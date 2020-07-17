import React from 'react';

import { gql } from '@apollo/client';
import Link from 'next/link';
import styled from 'styled-components';

import { MyNextPage } from '../lib/types';

import { indexQuery } from './__generated__/indexQuery';

const Hmm = styled.div`
	font-size: 25px;
	background: blue;
`;

interface Props {
	test: {
		id: string;
		name: string;
	};
}

const IndexPage: MyNextPage<Props> = ({ test }) => {
	return (
		<div>
			<Link href="/another">
				<a>To another</a>
			</Link>
			<Hmm>
				{test.id}: {test.name}
			</Hmm>
		</div>
	);
};

IndexPage.getInitialProps = async ({ apolloClient }) => {
	const { data } = await apolloClient.query<indexQuery>({
		query: gql`
			query indexQuery {
				test {
					id
					name
				}
			}
		`,
	});

	if (!data) {
		throw new Error("Couldn't fetch data");
	}

	return {
		test: data.test,
	};
};

export default IndexPage;
