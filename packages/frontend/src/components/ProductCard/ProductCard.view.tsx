import React from 'react';

import Link from 'next/link';
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

interface ProductCardViewProps {
	product: ProductCard_product;
}

const ProductCardView = ({ product }: ProductCardViewProps) => {
	return (
		<div>
			<Link href="/products/[key]" as={`/products/${product.urlKey}`} passHref>
				<ProductImageWrapper>
					<ProductImage src="#" />
					<ProductTagsContainer>
						<ProductTagCondition>NY</ProductTagCondition>
						<ProductTagDiscount>-38%</ProductTagDiscount>
					</ProductTagsContainer>
				</ProductImageWrapper>
			</Link>
			<ProductDetails>
				<Link href="/products/[key]" as={`/products/${product.urlKey}`} passHref>
					<ProductName>{product.name}</ProductName>
				</Link>
				<div>
					<ProductPrice>{product.price.toFixed(2).replace('.', ',')} kr</ProductPrice>
					<ProductSpecialPrice>{Number(17).toFixed(2).replace('.', ',')} kr</ProductSpecialPrice>
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
