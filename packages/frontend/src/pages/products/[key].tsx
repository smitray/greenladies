import React from 'react';

import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { ProductDetails } from '../../components/ProductDetails';
import { ProductImageGallery } from '../../components/ProductImageGallery';
import { MyNextPage } from '../../lib/types';
import { PRODUCT_QUERY, ProductQuery } from '../../queries/product';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
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

	return (
		<CenterWrapper>
			<div style={{ display: 'flex' }}>
				<div style={{ flexBasis: '50%', marginRight: '24px' }}>
					<ProductImageGallery product={product} />
				</div>
				<div style={{ flexBasis: '50%', marginLeft: '24px' }}>
					<ProductDetails product={product} />
				</div>
			</div>
			<div>Liknande produkter</div>
		</CenterWrapper>
	);
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
