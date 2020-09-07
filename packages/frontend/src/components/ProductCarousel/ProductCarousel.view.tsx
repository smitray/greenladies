import React, { useState } from 'react';

import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { createFragmentContainer, graphql } from 'react-relay';

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
				style={{
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						padding: `0 calc((100vw - 1240px) / 2)`,
					}}
				>
					<ul
						style={{
							display: 'flex',
							listStyle: 'none',
							margin: '0',
							width: '200%',
							padding: '0',
							transform: `translateX(-${25 * index}%)`,
							transition: 'all 300ms',
						}}
					>
						{products.edges.map(({ node: product }, index) => {
							return (
								<li
									id={index.toString()}
									key={index}
									style={{
										width: '25%',
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
