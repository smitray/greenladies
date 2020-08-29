import React, { useEffect, useMemo, useState } from 'react';

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
	const refs = useMemo(
		() =>
			products.edges.reduce<React.RefObject<HTMLLIElement>[]>((acc, _value, index) => {
				acc[index] = React.createRef();
				return acc;
			}, []),
		[products.edges],
	);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		setIndex(0);
		const ref = refs[0];
		if (ref) {
			if (ref.current) {
				// ref.current.scrollIntoView();
			}
		}
	}, [refs]);

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
						const nextIndex = index - 1;
						setIndex(index => index - 1);
						const ref = refs[nextIndex];
						if (ref.current) {
							ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
						}
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
						const nextIndex = index + UPPER_ITEM_INDEX_OFFSET + 1;
						setIndex(index => index + 1);
						const ref = refs[nextIndex];
						if (ref.current) {
							ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
						}
					}}
				>
					<div style={{ width: '32px', height: '32px' }}>
						<FaAngleRight size="32" />
					</div>
				</button>
			)}
			<ul
				style={{
					position: 'relative',
					display: 'flex',
					overflow: 'hidden',
					scrollPadding: `0 ${sidePadding}px`,
					padding: `16px ${sidePadding}px`,
					margin: '0',
					listStyle: 'none',
				}}
			>
				{products.edges.map(({ node: product }, index) => {
					return (
						<li
							id={index.toString()}
							key={index}
							ref={refs[index]}
							style={{ flexShrink: 0, flexBasis: '25%', maxWidth: '25%', padding: '0 8px' }}
						>
							<ProductCard product={product} />
						</li>
					);
				})}
				<li key={index} ref={refs[index]} style={{ flexShrink: 0, flexBasis: '1000px', padding: '0 8px' }}></li>
			</ul>
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
