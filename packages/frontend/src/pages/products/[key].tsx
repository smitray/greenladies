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
import { CenterWrapper } from '../../styles/center-wrapper';

const SomeWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	padding: 24px 0;

	@media (min-width: 961px) {
		grid-template-columns: fit-content(50%) 1fr;
	}
`;

const ProductImageGalleryWrapper = styled.div`
	@media (min-width: 961px) {
		max-width: 480px;
		gap: 48px;
	}
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
				<SomeWrapper>
					<ProductImageGalleryWrapper>
						<ProductImageGallery product={product} />
					</ProductImageGalleryWrapper>
					<div>
						<ProductDetails product={product} />
					</div>
				</SomeWrapper>
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
