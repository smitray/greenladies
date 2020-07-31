import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { ProductCard } from '../ProductCard';

import { ProductList_category } from './__generated__/ProductList_category.graphql';

interface Props {
	category: ProductList_category;
}

const ProductListView: React.FC<Props> = ({ category }) => {
	if (!category.products) {
		return <div>No products found</div>;
	}

	return (
		<div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
			{category.products.edges.map(edge => (
				<ProductCard key={edge.node.id} product={edge.node} />
			))}
			{category.products.edges.map(edge => (
				<ProductCard key={edge.node.id} product={edge.node} />
			))}
			{category.products.edges.map(edge => (
				<ProductCard key={edge.node.id} product={edge.node} />
			))}
		</div>
	);
};

export default createFragmentContainer(ProductListView, {
	category: graphql`
		fragment ProductList_category on Category {
			products {
				edges {
					node {
						id
						...ProductCard_product
					}
				}
			}
		}
	`,
});
