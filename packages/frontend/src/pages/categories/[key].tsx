import React from 'react';

import { fetchQuery, QueryRenderer } from 'react-relay';
import styled from 'styled-components';

import { CategorySidebar } from '../../components/CategorySidebar';
import { ProductList } from '../../components/ProductList';
import { useRelayEnvironment } from '../../lib/relay-environment';
import { MyNextPage } from '../../lib/types';
import { CATEGORY_QUERY, CategoryQuery } from '../../queries/category';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	display: flex;
`;

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
						<CenterWrapper>
							<div style={{ width: '200px', paddingRight: '20px' }}>
								<CategorySidebar category={props.category} />
							</div>
							<div style={{ flexGrow: 1 }}>
								<ProductList category={props.category} />
							</div>
						</CenterWrapper>
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
