import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { ProductCard } from '../ProductCard';

import { ProductGrid_products } from './__generated__/ProductGrid_products.graphql';

interface ProductListViewProps {
	products: ProductGrid_products;
}

const ProductGridView = ({ products }: ProductListViewProps) => {
	return (
		<div>
			{products.edges.length > 0 && (
				<div
					style={{
						display: 'grid',
						gap: '24px',
						gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
					}}
				>
					{products.edges.map(({ node: product }) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</div>
	);
};

export default createFragmentContainer(ProductGridView, {
	products: graphql`
		fragment ProductGrid_products on ProductConnection @argumentDefinitions(filters: { type: "ProductFiltersInput" }) {
			edges {
				node {
					id
					...ProductCard_product
				}
			}
		}
	`,
});
