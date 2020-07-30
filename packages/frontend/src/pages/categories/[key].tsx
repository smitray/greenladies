import React from 'react';

import { fetchQuery, QueryRenderer } from 'react-relay';

import { CategorySidebar } from '../../components/CategorySidebar';
import { ProductList } from '../../components/ProductList';
import { useRelayEnvironment } from '../../lib/relay-environment';
import { MyNextPage } from '../../lib/types';
import { CATEGORY_QUERY, CategoryQuery } from '../../queries/category';

interface Props {
	categoryUrlKey: string;
}

const Category: MyNextPage<Props> = ({ categoryUrlKey }) => {
	const environment = useRelayEnvironment();

	return (
		<QueryRenderer<CategoryQuery>
			fetchPolicy="store-and-network"
			environment={environment}
			query={CATEGORY_QUERY}
			variables={{ where: { urlKey: categoryUrlKey } }}
			render={({ error, props }) => {
				if (error) {
					// TODO: error page
					return <div>{error.message}</div>;
				}

				if (props) {
					return (
						<React.Fragment>
							<CategorySidebar category={props.category} />
							<ProductList category={props.category} />
						</React.Fragment>
					);
				}

				return <div>Loading</div>;
			}}
		/>
	);
};

Category.getInitialProps = async ({ relayEnvironment, query }) => {
	const { key } = query;
	const categoryUrlKey = typeof key === 'string' ? key : '';
	await fetchQuery<CategoryQuery>(relayEnvironment, CATEGORY_QUERY, {
		where: {
			urlKey: categoryUrlKey,
		},
	});

	return { categoryUrlKey };
};

export default Category;
