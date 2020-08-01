import React, { useState } from 'react';

import { createFragmentContainer, fetchQuery, graphql } from 'react-relay';

import { useRelayEnvironment } from '../../lib/relay-environment';
import { ProductCard } from '../ProductCard';

import { ProductList_category } from './__generated__/ProductList_category.graphql';
import { ProductListProductsQuery } from './__generated__/ProductListProductsQuery.graphql';

const PRODUCT_LIST_PRODUCTS_QUERY = graphql`
	query ProductListProductsQuery($where: CategoryWhereUniqueInput!, $orderBy: OrderProducts) {
		category(where: $where) {
			products(orderBy: $orderBy) {
				edges {
					node {
						id
						...ProductCard_product
					}
				}
			}
		}
	}
`;

interface Props {
	category: ProductList_category;
}

const ProductListView: React.FC<Props> = ({ category }) => {
	const [products, setProducts] = useState(category.products?.edges.map(edge => edge.node) || []);
	const relayEnviroment = useRelayEnvironment();

	if (products.length === 0) {
		return <div>No products found</div>;
	}

	return (
		<div>
			<select
				name="sort"
				id="sort"
				onChange={e => {
					console.log(e.target.value);
					if (
						e.target.value === 'popularity_DESC' ||
						e.target.value === 'created_DESC' ||
						e.target.value === 'price_ASC' ||
						e.target.value === 'price_DESC' ||
						e.target.value === 'discount_DESC'
					) {
						fetchQuery<ProductListProductsQuery>(relayEnviroment, PRODUCT_LIST_PRODUCTS_QUERY, {
							where: {
								id: category.id,
							},
							orderBy: e.target.value,
						}).then(response => {
							const products = response.category.products?.edges.map(edge => edge.node) || [];
							setProducts(products);
						});
					}
				}}
			>
				<option value="popularity_DESC">Popularitet</option>
				<option value="created_DESC">Nyheter</option>
				<option value="price_ASC">Lägsta pris</option>
				<option value="price_DESC">Högsta pris</option>
				<option value="discount_DESC">Högst rabatt</option>
			</select>
			<div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
				{products.map(product => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
};

export default createFragmentContainer(ProductListView, {
	category: graphql`
		fragment ProductList_category on Category {
			id
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
