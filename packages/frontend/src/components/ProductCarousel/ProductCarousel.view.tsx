import React, { useEffect, useState } from 'react';

import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { useWindowDimensions } from '../../hooks/use-window-dimensions';
import { CenterWrapper } from '../../styles/center-wrapper';
import { IconWrapper } from '../../styles/icon-wrapper';
import { ProductCard } from '../ProductCard';

import { ProductCarousel_products } from './__generated__/ProductCarousel_products.graphql';

const ProductsContainer = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	width: 200%;
	transition: transform 300ms;
	position: relative;

	@media (min-width: 641px) {
		width: 133.3%;
	}

	@media (min-width: 961px) {
		width: 100%;
	}
`;

const ArrowButton = styled.button`
	position: absolute;
	padding: 8px;
	background: white;
	border: 1px solid lightgrey;
	outline: none;
	z-index: 10;
	top: calc(50% - 48px);
	cursor: pointer;
`;

const ProductItem = styled.li`
	width: 25%;
	flex-grow: 0;
	flex-shrink: 0;
	padding: 0 8px;
`;

interface ProductCarouselViewProps {
	products: ProductCarousel_products;
}

function calculateItemsInView(windowWidth: number) {
	if (windowWidth >= 961) {
		return 4;
	}

	if (windowWidth >= 641) {
		return 3;
	}

	return 2;
}

const ProductCarouselView = ({ products }: ProductCarouselViewProps) => {
	const { width: windowWidth } = useWindowDimensions();
	const [index, setIndex] = useState(0);
	const [carouselItemsInView, setCarouselItemsInView] = useState(calculateItemsInView(windowWidth));
	useEffect(() => {
		setCarouselItemsInView(calculateItemsInView(windowWidth));
	}, [windowWidth]);

	return (
		<div
			style={{
				overflow: 'hidden',
			}}
		>
			<CenterWrapper style={{ position: 'relative' }}>
				<div style={{ margin: '0 -8px' }}>
					<ProductsContainer style={{ transform: `translateX(-${25 * index}%)` }}>
						{products.edges.map(({ node: product }, index) => {
							return (
								<ProductItem id={index.toString()} key={index}>
									<ProductCard product={product} />
								</ProductItem>
							);
						})}
					</ProductsContainer>
				</div>
				{index > 0 && (
					<ArrowButton
						style={{
							left: '8px',
						}}
						onClick={() => {
							setIndex(index => index - 1);
						}}
					>
						<IconWrapper size="32px">
							<FaAngleLeft size="32px" />
						</IconWrapper>
					</ArrowButton>
				)}
				{index + carouselItemsInView < products.edges.length && (
					<ArrowButton
						style={{
							right: '8px',
						}}
						onClick={() => {
							setIndex(index => index + 1);
						}}
					>
						<IconWrapper size="32px">
							<FaAngleRight size="32px" />
						</IconWrapper>
					</ArrowButton>
				)}
			</CenterWrapper>
		</div>
	);
};

export default createFragmentContainer(ProductCarouselView, {
	products: graphql`
		fragment ProductCarousel_products on ProductConnection {
			edges {
				node {
					...ProductCard_product
				}
			}
		}
	`,
});
