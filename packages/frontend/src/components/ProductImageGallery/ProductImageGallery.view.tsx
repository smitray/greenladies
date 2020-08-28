import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { ProductImageGallery_product } from './__generated__/ProductImageGallery_product.graphql';

interface ProductImageGalleryViewProps {
	product: ProductImageGallery_product;
}

const ProductImageGalleryView = ({ product }: ProductImageGalleryViewProps) => {
	return (
		<div>
			{product.images.map(img => (
				<div key={img}>{img}</div>
			))}
		</div>
	);
};

export default createFragmentContainer(ProductImageGalleryView, {
	product: graphql`
		fragment ProductImageGallery_product on Product {
			images
		}
	`,
});
