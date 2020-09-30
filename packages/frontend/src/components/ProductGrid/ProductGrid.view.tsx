import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { ProductCard } from '../ProductCard';

import { ProductGrid_products } from './__generated__/ProductGrid_products.graphql';

const ProductGridContainer = styled.div`
	display: grid;
	gap: 12px;
	grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));

	@media (min-width: 420px) {
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}

	@media (min-width: 641px) {
		grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
	}

	@media (min-width: 961px) {
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 24px;
	}
`;

interface ProductListViewProps {
	products: ProductGrid_products;
}

const ProductGridView = ({ products }: ProductListViewProps) => {
	return (
		<div>
			{products.edges.length > 0 && (
				<ProductGridContainer>
					{products.edges.map(({ node: product }) => (
						<ProductCard key={product.id} product={product} />
					))}
				</ProductGridContainer>
			)}
			{products.edges.length === 0 && (
				<div style={{ padding: '48px 0', color: 'grey', textAlign: 'center' }}>Inga produkter hittades</div>
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
