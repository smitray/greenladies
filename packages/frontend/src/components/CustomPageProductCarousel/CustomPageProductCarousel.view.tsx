import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { useWindowDimensions } from '../../hooks/use-window-dimensions';
import { ProductCarousel } from '../ProductCarousel';

import { CustomPageProductCarousel_carousel } from './__generated__/CustomPageProductCarousel_carousel.graphql';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	padding: 0 40px;
	display: flex;
	align-items: flex-start;
`;

interface CustomPageProductCarouselViewProps {
	carousel: CustomPageProductCarousel_carousel;
}

const CustomPageProductCarouselView = ({ carousel }: CustomPageProductCarouselViewProps) => {
	const { width: windowWidth } = useWindowDimensions();

	return (
		<div style={{ padding: '24px 0' }}>
			<CenterWrapper>
				<div>
					<h1 style={{ margin: '0 0 16px 0' }}>Underbara pasteller</h1>
					<div style={{ marginBottom: '24px', color: '#999999' }}>Få inspiration till vårens favoritfärg</div>
				</div>
			</CenterWrapper>
			<ProductCarousel products={carousel.products} sidePadding={Math.max(windowWidth - 1240, 40) / 2} />
		</div>
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
