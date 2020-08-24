import React from 'react';

import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { MyNextPage } from '../../lib/types';
import { useAddToCartMutation } from '../../mutations/shopping-cart';
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
	const { commit: addToCart } = useAddToCartMutation();

	return (
		<CenterWrapper>
			<div>id: {product.id}</div>
			<div>name: {product.name}</div>
			<div>
				{product.virtualProducts.map(virtualProduct => (
					<div key={virtualProduct.id}>
						{virtualProduct.id}:{virtualProduct.size}
						<button onClick={() => addToCart(virtualProduct.id)}>Add to cart</button>
					</div>
				))}
			</div>
			<div>
				{product.images.map((imagePath, index) => (
					<img key={index} src={`http://localhost:8081/media/catalog/product/${imagePath}`} alt="" />
				))}
			</div>
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
