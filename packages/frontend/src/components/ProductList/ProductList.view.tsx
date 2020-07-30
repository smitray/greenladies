import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { ProductList_category } from './__generated__/ProductList_category.graphql';

interface Props {
	category: ProductList_category;
}

const ProductListView: React.FC<Props> = ({ category }) => {
	if (!category.products) {
		return <div>No products found</div>;
	}

	return (
		<div>
			{category.products.edges.map(product => (
				<div key={product.node.id}>{product.node.name}</div>
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
						sku
						name
					}
				}
			}
		}
	`,
});
