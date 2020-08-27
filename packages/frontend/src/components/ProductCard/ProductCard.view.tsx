import React from 'react';

import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';

import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../../mutations/wishlist';

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
	ProductWishlist,
} from './ProductCard.styles';

interface ProductCardViewProps {
	product: ProductCard_product;
}

const ProductCardView = ({ product }: ProductCardViewProps) => {
	const { commit: addToWishlist, pending: addToWishlistPending } = useAddToWishlistMutation();
	const { commit: removeFromWishlist, pending: removeFromWishlistPending } = useRemoveFromWishlistMutation();

	const handleWishlistClick = () => {
		if (product.inWishlist) {
			removeFromWishlist(product.id);
		} else {
			addToWishlist(product.id);
		}
	};

	const discount = Math.round(((product.originalPrice - product.specialPrice) / product.originalPrice) * 100);

	return (
		<div>
			<Link href="/products/[key]" as={`/products/${product.urlKey}`} passHref>
				<ProductImageWrapper>
					<ProductImage src="#" />
					<ProductTagsContainer>
						<ProductTagCondition>NY</ProductTagCondition>
						<ProductTagDiscount>-{discount}%</ProductTagDiscount>
					</ProductTagsContainer>
				</ProductImageWrapper>
			</Link>
			<ProductDetails>
				<Link href="/products/[key]" as={`/products/${product.urlKey}`} passHref>
					<ProductName>{product.name}</ProductName>
				</Link>
				<div>
					<ProductPrice>{product.originalPrice.toFixed(2).replace('.', ',')} kr</ProductPrice>
					<ProductSpecialPrice>{product.specialPrice.toFixed(2).replace('.', ',')} kr</ProductSpecialPrice>
				</div>
				<ProductBrand>{product.brand}</ProductBrand>
				<ProductWishlist disabled={addToWishlistPending || removeFromWishlistPending} onClick={handleWishlistClick}>
					{product.inWishlist ? ':noheart:' : ':heart:'}
				</ProductWishlist>
			</ProductDetails>
		</div>
	);
};

export default createFragmentContainer(ProductCardView, {
	product: graphql`
		fragment ProductCard_product on Product {
			id
			name
			urlKey
			originalPrice
			specialPrice
			currency
			brand
			inWishlist
		}
	`,
});
