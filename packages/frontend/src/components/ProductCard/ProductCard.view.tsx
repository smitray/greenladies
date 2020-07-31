import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { ProductCard_product } from './__generated__/ProductCard_product.graphql';

const ProductDetails = styled.div`
	padding-top: 20px;
`;

const ProductImageWrapper = styled.div`
	position: relative;
	background: grey;
`;

const ProductImage = styled.img`
	display: block;
	height: 250px;
`;

const ProductTags = styled.div`
	top: 0;
	position: absolute;
`;

interface Props {
	product: ProductCard_product;
}

const ProductCardView: React.FC<Props> = ({ product }) => {
	return (
		<div>
			<ProductImageWrapper>
				<ProductImage src="#" />
				<ProductTags>
					<div style={{ background: 'green', marginTop: '20px' }}>condition</div>
					<div style={{ background: 'blue', marginTop: '20px' }}>discount</div>
				</ProductTags>
			</ProductImageWrapper>
			<ProductDetails>
				<div>{product.name}</div>

				<div>{product.price}</div>
				<div>special price</div>
				<div>brand</div>
			</ProductDetails>
		</div>
	);
};

export default createFragmentContainer(ProductCardView, {
	product: graphql`
		fragment ProductCard_product on Product {
			name
			price
			urlKey
		}
	`,
});
