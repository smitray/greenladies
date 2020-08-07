import React from 'react';

import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { MyNextPage } from '../../lib/types';
import { PRODUCT_QUERY, ProductQuery } from '../../queries/product';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	display: flex;
`;

interface Props {
	productUrlKey: string;
}

const Category: MyNextPage<Props> = ({ productUrlKey }) => {
	const { product } = useLazyLoadQuery<ProductQuery>(
		PRODUCT_QUERY,
		{ where: { urlKey: productUrlKey } },
		{ fetchPolicy: 'store-only' },
	);

	return <CenterWrapper>Product {product.id}</CenterWrapper>;
};

Category.getInitialProps = async ({ relayEnvironment, query }) => {
	const { key } = query;
	const productUrlKey = typeof key === 'string' ? key : '';
	await fetchQuery<ProductQuery>(relayEnvironment, PRODUCT_QUERY, {
		where: {
			urlKey: productUrlKey,
		},
	});

	return { productUrlKey };
};

export default Category;
