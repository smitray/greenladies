import React from 'react';

import Link from 'next/link';
import styled from 'styled-components';

import { PageQuery } from '../__generated__/PageQuery';
import { MyNextPage } from '../lib/types';
import { PAGE_QUERY } from '../page-query';

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

const Page: MyNextPage<Props> = ({ test }) => {
	return (
		<div>
			<Link href="/">
				<a>To index</a>
			</Link>
			<Hmm>
				{test.id}: {test.name}
			</Hmm>
		</div>
	);
};

Page.getInitialProps = async ({ apolloClient }) => {
	const { data } = await apolloClient.query<PageQuery>({
		query: PAGE_QUERY,
	});

	if (!data) {
		throw new Error("Couldn't fetch data");
	}

	return {
		test: data.test,
	};
};

export default Page;
