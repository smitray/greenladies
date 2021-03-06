import React from 'react';

import Head from 'next/head';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { ProductCarousel } from '../../components/ProductCarousel';
import { ProductDetails } from '../../components/ProductDetails';
import { ProductImageGallery } from '../../components/ProductImageGallery';
import { MyNextPage } from '../../lib/types';
import { PRODUCT_QUERY, ProductQuery } from '../../queries/product';
import { CenterWrapper } from '../../styles/center-wrapper';
import { HideOnMinSize, ShowOnMinSize } from '../../styles/responsive';

const SomeWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 24px;
	padding-bottom: 24px;

	@media (min-width: 641px) {
		padding: 24px 0;
		grid-template-columns: 1fr 1fr;
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

	return (
		<React.Fragment>
			<Head>
				<title>{product.metaTitle}</title>
				<meta name="keywords" content={product.metaKeyword} />
				<meta name="description" content={product.metaDescription} />
				<meta name="robots" content="index,follow" />
			</Head>
			<HideOnMinSize size="m">
				<SomeWrapper>
					<div>
						<ProductImageGallery product={product} />
					</div>
					<div>
						<CenterWrapper>
							<ProductDetails product={product} />
						</CenterWrapper>
					</div>
				</SomeWrapper>
			</HideOnMinSize>
			<ShowOnMinSize size="m">
				<CenterWrapper>
					<SomeWrapper>
						<div>
							<ProductImageGallery product={product} />
						</div>
						<div>
							<ProductDetails product={product} />
						</div>
					</SomeWrapper>
				</CenterWrapper>
			</ShowOnMinSize>

			{product.relatedProducts.totalCount > 0 && (
				<React.Fragment>
					<CenterWrapper style={{ marginTop: '24px' }}>
						<div style={{ fontSize: '24px', fontWeight: 'bold', color: 'grey' }}>Vad s??gs om dessa?</div>
						<div style={{ fontSize: '24px', fontWeight: 'bold' }}>Liknande produkter</div>
					</CenterWrapper>
					<ProductCarousel products={product.relatedProducts} />
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
