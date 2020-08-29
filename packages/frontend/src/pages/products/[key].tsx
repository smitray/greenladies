import React from 'react';

import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { ProductCarousel } from '../../components/ProductCarousel';
import { ProductDetails } from '../../components/ProductDetails';
import { ProductImageGallery } from '../../components/ProductImageGallery';
import { useWindowDimensions } from '../../hooks/use-window-dimensions';
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
	const { width: windowWidth } = useWindowDimensions();

	return (
		<React.Fragment>
			<CenterWrapper>
				<div style={{ display: 'flex' }}>
					<div style={{ flexBasis: '50%', marginRight: '24px' }}>
						<ProductImageGallery product={product} />
					</div>
					<div style={{ flexBasis: '50%', marginLeft: '24px' }}>
						<ProductDetails product={product} />
					</div>
				</div>
			</CenterWrapper>
			{product.relatedProducts.totalCount > 0 && (
				<React.Fragment>
					<CenterWrapper style={{ marginTop: '24px' }}>
						<div style={{ fontSize: '24px', fontWeight: 'bold', color: 'grey' }}>Vad sägs om dessa?</div>
						<div style={{ fontSize: '24px', fontWeight: 'bold' }}>Liknande produkter</div>
					</CenterWrapper>
					<ProductCarousel
						products={product.relatedProducts}
						sidePadding={windowWidth < 1240 ? 40 : (windowWidth - 1240) / 2 + 40}
					/>
				</React.Fragment>
			)}
		</React.Fragment>
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
