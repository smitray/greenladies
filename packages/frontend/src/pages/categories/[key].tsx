import React from 'react';

import Link from 'next/link';
import { fetchQuery, QueryRenderer } from 'react-relay';

import { CategorySidebar } from '../../components/CategorySidebar';
import { useRelayEnvironment } from '../../lib/relay-environment';
import { MyNextPage } from '../../lib/types';
import { CATEGORY_QUERY, CategoryQuery } from '../../queries/category';

interface Props {
	categoryKey: string;
}

const Category: MyNextPage<Props> = ({ categoryKey }) => {
	const environment = useRelayEnvironment();

	return (
		<QueryRenderer<CategoryQuery>
			fetchPolicy="store-and-network"
			environment={environment}
			query={CATEGORY_QUERY}
			variables={{ where: { key: categoryKey } }}
			render={({ error, props }) => {
				if (error) {
					return <div>{error.message}</div>;
				}

				if (props) {
					return (
						<div>
							<CategorySidebar category={props.category} />
							{props.category.id}
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
				}

				return <div>Loading</div>;
			}}
		/>
	);
};

Category.getInitialProps = async ({ relayEnvironment, query }) => {
	const { key } = query;
	const categoryKey = typeof key === 'string' ? key : '';
	await fetchQuery<CategoryQuery>(relayEnvironment, CATEGORY_QUERY, {
		where: {
			key: categoryKey,
		},
	});

	return { categoryKey };
};

export default Category;
