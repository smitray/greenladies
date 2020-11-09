import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';
import { Carousel } from 'react-responsive-carousel';
import { createGlobalStyle } from 'styled-components';

import { ProductImageGalleryMobile_product } from './__generated__/ProductImageGalleryMobile_product.graphql';

const CarouselStatusStyles = createGlobalStyle`
  .carousel .carousel-status {
    font-size: 14px;
    font-family: sans-serif;
    color: black;
    text-shadow: none;
    bottom: 16px;
    left: 16px;
    right: inital;
    top: initial;
    margin: 0;
    padding: 0;
  }
`;

interface ProductImageGalleryMobileViewProps {
	product: ProductImageGalleryMobile_product;
}

export const ProductImageGalleryMobileView = ({ product }: ProductImageGalleryMobileViewProps) => {
	return (
		<React.Fragment>
			<CarouselStatusStyles />
			<Carousel
				showArrows={true}
				emulateTouch
				swipeable
				width="100%"
				renderArrowPrev={() => null}
				renderArrowNext={() => null}
				showThumbs={false}
				showIndicators={false}
				statusFormatter={(current, total) => `${current} / ${total}`}
			>
				{product.images.map((image, index) => (
					<div key={index} style={{ cursor: 'pointer' }}>
						<img src={image} />
					</div>
				))}
			</Carousel>
		</React.Fragment>
	);
};

export default createFragmentContainer(ProductImageGalleryMobileView, {
	product: graphql`
		fragment ProductImageGalleryMobile_product on Product {
			image
			images
			condition
		}
	`,
});
