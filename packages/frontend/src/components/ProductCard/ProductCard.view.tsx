import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { ProductCard_product } from './__generated__/ProductCard_product.graphql';
import {
	ProductBrand,
	ProductDetails,
	ProductImage,
	ProductImageWrapper,
	ProductName,
	ProductPrice,
	ProductSpecialPrice,
	ProductTagCondition,
	ProductTagDiscount,
	ProductTagsContainer,
} from './ProductCard.styles';

interface Props {
	product: ProductCard_product;
}

const ProductCardView: React.FC<Props> = ({ product }) => {
	return (
		<div>
			<ProductImageWrapper>
				<ProductImage src="#" />
				<ProductTagsContainer>
					<ProductTagCondition>NY</ProductTagCondition>
					<ProductTagDiscount>-38%</ProductTagDiscount>
				</ProductTagsContainer>
			</ProductImageWrapper>
			<ProductDetails>
				<ProductName>{product.name}</ProductName>
				<div>
					<ProductPrice>{product.price} kr</ProductPrice>
					<ProductSpecialPrice>17 kr</ProductSpecialPrice>
				</div>
				<ProductBrand>Gant</ProductBrand>
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
