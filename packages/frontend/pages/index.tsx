import React from 'react';

import { gql } from '@apollo/client';
import Link from 'next/link';
import styled from 'styled-components';

import { MyNextPage } from '../lib/types';

const Hmm = styled.div`
	font-size: 25px;
	background: blue;
`;

interface Props {
	test: {
		id: string;
		name: number;
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

	return {
		test: data.test,
	};
};

export default IndexPage;
