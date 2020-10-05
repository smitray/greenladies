import React from 'react';

import Link from 'next/link';
import { VscArrowRight } from 'react-icons/vsc';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { CenterWrapper } from '../../styles/center-wrapper';
import { IconWrapper } from '../../styles/icon-wrapper';
import { ProductCarousel } from '../ProductCarousel';

import { CustomPageProductCarousel_carousel } from './__generated__/CustomPageProductCarousel_carousel.graphql';

const SomeKindOfWrapper = styled.div`
	padding: 72px 0;
`;

const WrapOnMobile = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	flex-direction: column;
	margin-bottom: 32px;

	@media (min-width: 641px) {
		flex-direction: row;
		align-items: flex-end;
	}
`;

interface CustomPageProductCarouselViewProps {
	carousel: CustomPageProductCarousel_carousel;
}

const CustomPageProductCarouselView = ({ carousel }: CustomPageProductCarouselViewProps) => {
	return (
		<SomeKindOfWrapper>
			<CenterWrapper>
				<WrapOnMobile>
					<div>
						<h2 style={{ margin: '0', fontSize: '32px' }}>
							<Link href="/categories/special/[key]" as={`/categories/special/${carousel.category.urlKey}`}>
								<a style={{ color: 'inherit', textDecoration: 'none' }}>{carousel.title}</a>
							</Link>
						</h2>
						<Link href="/categories/special/[key]" as={`/categories/special/${carousel.category.urlKey}`}>
							<a
								style={{
									fontFamily: 'Arimo, sans-serif',
									fontSize: '28px',
									color: 'inherit',
									textDecoration: 'none',
								}}
							>
								{carousel.subtitle}
							</a>
						</Link>
					</div>
					<Link href="/categories/special/[key]" as={`/categories/special/${carousel.category.urlKey}`}>
						<a
							style={{
								color: 'inherit',
								textDecoration: 'none',
								display: 'flex',
								fontSize: '24px',
								alignItems: 'center',
								marginTop: '24px',
							}}
						>
							<span style={{ marginRight: '8px' }}>Shoppa</span>
							<IconWrapper size="24px">
								<VscArrowRight size="24" />
							</IconWrapper>
						</a>
					</Link>
				</WrapOnMobile>
			</CenterWrapper>
			<ProductCarousel products={carousel.category.products} />
		</SomeKindOfWrapper>
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
