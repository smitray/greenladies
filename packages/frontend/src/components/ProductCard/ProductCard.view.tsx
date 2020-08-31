import React from 'react';

import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { createFragmentContainer, graphql } from 'react-relay';

import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../../mutations/wishlist';

import { ProductCard_product } from './__generated__/ProductCard_product.graphql';
import {
	ProductBrand,
	ProductCardWrapper,
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
		<Link href="/products/[key]" as={`/products/${product.urlKey}`} passHref>
			<ProductCardWrapper>
				<ProductImageWrapper>
					<div style={{ position: 'absolute', top: '0', right: '5%', bottom: '0', left: '5%' }}>
						<ProductImage src={product.image} />
					</div>
					<ProductTagsContainer>
						<ProductTagCondition>{product.condition === 'new' ? 'NY' : 'VINTAGE'}</ProductTagCondition>
						{discount > 0 && <ProductTagDiscount>-{discount}%</ProductTagDiscount>}
					</ProductTagsContainer>
					<ProductWishlist
						disabled={addToWishlistPending || removeFromWishlistPending}
						onClick={e => {
							e.preventDefault();
							handleWishlistClick();
						}}
					>
						{product.inWishlist ? <FaHeart color="red" size="20" /> : <FaRegHeart size="20" />}
					</ProductWishlist>
				</ProductImageWrapper>
				<ProductDetails>
					<div style={{ display: 'flex' }}>
						<div style={{ marginRight: '8px', overflow: 'hidden', flexGrow: 1 }}>
							<ProductBrand>{product.brand}</ProductBrand>
							<ProductName>{product.name}</ProductName>
						</div>
						<div>
							<ProductPrice>{product.originalPrice} kr</ProductPrice>
							<ProductSpecialPrice>{product.specialPrice} kr</ProductSpecialPrice>
						</div>
					</div>
				</ProductDetails>
			</ProductCardWrapper>
		</Link>
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
			image
			condition
		}
	`,
});
