import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { CenterWrapper } from '../../styles/center-wrapper';
import { ProductCarousel } from '../ProductCarousel';

import { CustomPageProductCarousel_carousel } from './__generated__/CustomPageProductCarousel_carousel.graphql';

const SomeKindOfWrapper = styled.div`
	padding: 1.5em 0;
`;

interface CustomPageProductCarouselViewProps {
	carousel: CustomPageProductCarousel_carousel;
}

const CustomPageProductCarouselView = ({ carousel }: CustomPageProductCarouselViewProps) => {
	return (
		<SomeKindOfWrapper>
			<CenterWrapper>
				<h1 style={{ margin: '0 0 16px 0' }}>{carousel.title}</h1>
				<div style={{ marginBottom: '24px', color: '#999999' }}>{carousel.subtitle}</div>
			</CenterWrapper>
			<ProductCarousel products={carousel.products} />
		</SomeKindOfWrapper>
	);
};

export default createFragmentContainer(CustomPageProductCarouselView, {
	carousel: graphql`
		fragment CustomPageProductCarousel_carousel on CustomPageProductCarousel {
			title
			subtitle
			products {
				...ProductCarousel_products
			}
		}
	`,
});
