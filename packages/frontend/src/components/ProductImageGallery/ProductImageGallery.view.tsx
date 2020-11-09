import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { HideOnMinSize, ShowOnMinSize } from '../../styles/responsive';

import { ProductImageGallery_product } from './__generated__/ProductImageGallery_product.graphql';
import { ProductImageGalleryDesktop } from './ProductImageGalleryDesktop';
import { ProductImageGalleryMobile } from './ProductImageGalleryMobile';

interface ProductImageGalleryViewProps {
	product: ProductImageGallery_product;
}

const ProductImageGalleryView = ({ product }: ProductImageGalleryViewProps) => {
	return (
		<React.Fragment>
			<HideOnMinSize size="m">
				<ProductImageGalleryMobile product={product} />
			</HideOnMinSize>
			<ShowOnMinSize size="m">
				<ProductImageGalleryDesktop product={product} />
			</ShowOnMinSize>
		</React.Fragment>
	);
};

export default createFragmentContainer(ProductImageGalleryView, {
	product: graphql`
		fragment ProductImageGallery_product on Product {
			...ProductImageGalleryMobile_product
			...ProductImageGalleryDesktop_product
		}
	`,
});
