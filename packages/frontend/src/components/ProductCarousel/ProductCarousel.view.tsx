import React, { useEffect, useMemo, useRef, useState } from 'react';

import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { createFragmentContainer, graphql } from 'react-relay';

import { useElementDimensions } from '../../hooks/use-element-dimensions';
import { ProductCard } from '../ProductCard';

import { ProductCarousel_products } from './__generated__/ProductCarousel_products.graphql';

interface ProductCarouselViewProps {
	products: ProductCarousel_products;
	sidePadding: number;
}

const CAROUSEL_ITEMS_IN_VIEW = 4;
const UPPER_ITEM_INDEX_OFFSET = CAROUSEL_ITEMS_IN_VIEW - 1;

const ProductCarouselView = ({ products, sidePadding }: ProductCarouselViewProps) => {
	const [index, setIndex] = useState(0);
	const wrapperElement = useRef<HTMLDivElement>(null);
	const { width: wrapperWidth } = useElementDimensions(wrapperElement);

	const [initialRender, setInitialRender] = useState(true);
	useEffect(() => {
		setTimeout(() => setInitialRender(false), 50);
	}, []);

	const elementWidth = useMemo(() => (wrapperWidth - 2 * sidePadding) / 4, [wrapperWidth, sidePadding]);

	return (
		<div style={{ position: 'relative' }}>
			{index > 0 && (
				<button
					style={{
						position: 'absolute',
						padding: '8px',
						background: 'white',
						border: '1px solid lightgrey',
						outline: 'none',
						zIndex: 10,
						top: 'calc(50% - 48px)',
						left: `${sidePadding + 8}px`,
						cursor: 'pointer',
					}}
					onClick={() => {
						setIndex(index => index - 1);
					}}
				>
					<div style={{ width: '32px', height: '32px' }}>
						<FaAngleLeft size="32" />
					</div>
				</button>
			)}
			{index + UPPER_ITEM_INDEX_OFFSET < products.edges.length - 1 && (
				<button
					style={{
						position: 'absolute',
						padding: '8px',
						background: 'white',
						border: '1px solid lightgrey',
						outline: 'none',
						zIndex: 10,
						top: 'calc(50% - 48px)',
						right: `${sidePadding + 8}px`,
						cursor: 'pointer',
					}}
					onClick={() => {
						setIndex(index => index + 1);
					}}
				>
					<div style={{ width: '32px', height: '32px' }}>
						<FaAngleRight size="32" />
					</div>
				</button>
			)}
			<div
				ref={wrapperElement}
				style={{
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<div>
					<ul
						style={{
							display: 'flex',
							width: sidePadding + elementWidth * products.edges.length + 'px',
							listStyle: 'none',
							margin: '0',
							padding: '0',
							transform: `translateX(${sidePadding}px) translateX(-${elementWidth * index}px)`,
							transition: initialRender ? 'all 0ms' : 'all 300ms',
						}}
					>
						{products.edges.map(({ node: product }, index) => {
							return (
								<li
									id={index.toString()}
									key={index}
									style={{
										width: elementWidth + 'px',
										flexBasis: elementWidth + 'px',
										flexGrow: 0,
										flexShrink: 0,
										padding: '0 8px',
									}}
								>
									<ProductCard product={product} />
								</li>
							);
						})}
					</ul>
				</div>
			</div>
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
