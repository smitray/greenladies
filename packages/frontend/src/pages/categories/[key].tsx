import React from 'react';

import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { CategorySidebar } from '../../components/CategorySidebar';
import { ProductList } from '../../components/ProductList';
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
	const { category } = useLazyLoadQuery<CategoryQuery>(
		CATEGORY_QUERY,
		{ where: { urlKey: categoryUrlKey } },
		{ fetchPolicy: 'store-only' },
	);

	return (
		<CenterWrapper>
			<div style={{ width: '200px', paddingRight: '20px' }}>
				<CategorySidebar category={category} />
			</div>
			<div style={{ flexGrow: 1 }}>
				<h1 style={{ margin: '0 0 16px 0' }}>{category.name}</h1>
				<ProductList category={category} />
			</div>
		</CenterWrapper>
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
