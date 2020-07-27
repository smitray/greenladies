import React from 'react';

import Link from 'next/link';

import { MyNextPage } from '../lib/types';
import { categoryQueryResponse, fetchCategoryQuery } from '../queries/category';

interface Props {
	query: categoryQueryResponse;
}

const Page: MyNextPage<Props> = ({ query }) => {
	return (
		<div>
			{query.category.id}
			<Link href="/" as="/">
				<a>To index</a>
			</Link>
			<Link href="/?slug=/another" as="/another">
				<a>To another</a>
			</Link>
			<Link href="/?slug=/test/test" as="/test/test">
				<a>To third</a>
			</Link>
		</div>
	);
};

Page.getInitialProps = async ({ relayEnvironment, query }) => {
	const { key } = query;
	const result = await fetchCategoryQuery(relayEnvironment, {
		where: {
			key: typeof key === 'string' ? key : '',
		},
	});

	return { query: result };
};

export default Page;
