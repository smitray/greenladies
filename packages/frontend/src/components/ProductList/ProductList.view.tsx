import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { ProductCard } from '../ProductCard';

import { ProductList_products } from './__generated__/ProductList_products.graphql';

interface ProductListViewProps {
	products: ProductList_products;
}

const ProductListView = ({ products }: ProductListViewProps) => {
	return (
		<div>
			{products.edges.length > 0 && (
				<div
					style={{
						display: 'grid',
						gap: '24px',
						gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
						marginBottom: '32px',
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

export default createFragmentContainer(ProductListView, {
	products: graphql`
		fragment ProductList_products on ProductConnection @argumentDefinitions(filters: { type: "ProductFiltersInput" }) {
			edges {
				node {
					id
					...ProductCard_product
				}
			}
		}
	`,
});
