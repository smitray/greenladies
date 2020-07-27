import React from 'react';

import Link from 'next/link';

import { MyNextPage } from '../../lib/types';
import { categoryQueryResponse, fetchCategoryQuery } from '../../queries/category';

interface Props {
	query: categoryQueryResponse;
}

const Category: MyNextPage<Props> = ({ query }) => {
	return (
		<div>
			{query.category.id}
			<Link href="/categories/[key]" as="/categories/heh">
				<a>To heh</a>
			</Link>
			<Link href="/categories/[key]" as="/categories/meh">
				<a>To meh</a>
			</Link>
			<Link href="/">
				<a>To home</a>
			</Link>
		</div>
	);
};

Category.getInitialProps = async ({ relayEnvironment, query }) => {
	const { key } = query;
	const result = await fetchCategoryQuery(relayEnvironment, {
		where: {
			key: typeof key === 'string' ? key : '',
		},
	});

	return { query: result };
};

export default Category;
