import React from 'react';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { createFragmentContainer, graphql } from 'react-relay';

import { ProductCarousel } from '../../ProductCarousel';

import { CustomPageProductCarousel_carousel } from './__generated__/CustomPageProductCarousel_carousel.graphql';
import {
	ProductCarouselComponentWrapper,
	ProductCarouselShopIconWrapper,
	ProductCarouselShopLink,
	ProductCarouselSubtitle,
	ProductCarouselTitle,
	ProductCarouselTitleWrapper,
} from './CustomPageProductCarousel.styles';

interface CustomPageProductCarouselViewProps {
	carousel: CustomPageProductCarousel_carousel;
}

const CustomPageProductCarouselView = ({ carousel }: CustomPageProductCarouselViewProps) => {
	return (
		<ProductCarouselComponentWrapper>
			<ProductCarouselTitleWrapper>
				<div>
					<Link href="/categories/special/[key]" as={`/categories/special/${carousel.category.urlKey}`}>
						<ProductCarouselTitle>{carousel.title}</ProductCarouselTitle>
					</Link>
					<Link href="/categories/special/[key]" as={`/categories/special/${carousel.category.urlKey}`}>
						<ProductCarouselSubtitle>{carousel.subtitle}</ProductCarouselSubtitle>
					</Link>
				</div>
				<div>
					<Link href="/categories/special/[key]" as={`/categories/special/${carousel.category.urlKey}`}>
						<ProductCarouselShopLink>
							<span>Shoppa</span>
							<ProductCarouselShopIconWrapper size="20px">
								<FiArrowRight size="20px" />
							</ProductCarouselShopIconWrapper>
						</ProductCarouselShopLink>
					</Link>
				</div>
			</ProductCarouselTitleWrapper>
			<ProductCarousel products={carousel.category.products} />
		</ProductCarouselComponentWrapper>
	);
};

export default createFragmentContainer(CustomPageProductCarouselView, {
	carousel: graphql`
		fragment CustomPageProductCarousel_carousel on CustomPageProductCarousel {
			title
			subtitle
			category {
				id
				urlKey
				products {
					...ProductCarousel_products
				}
			}
		}
	`,
});
