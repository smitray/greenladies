import React, { useState } from 'react';

import { createFragmentContainer, fetchQuery, graphql } from 'react-relay';
import styled from 'styled-components';

import { useRelayEnvironment } from '../../lib/relay-environment';
import { CategoryFilterMultiSelect } from '../CategoryFilterMultiSelect';
import { CategoryFilterRangeSelect } from '../CategoryFilterRangeSelect';
import { CategoryFilterSingleSelect } from '../CategoryFilterSingleSelect';
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

const FiltersContainer = styled.ul`
	display: flex;
	margin: 0;
	padding: 0;
	list-style: none;
`;

interface Props {
	category: ProductList_category;
}

const ProductListView: React.FC<Props> = ({ category }) => {
	const [products, setProducts] = useState(category.products?.edges.map(edge => edge.node) || []);
	const [currentlyOpenedFilter, setCurrentlyOpenedFilter] = useState<string | null>(null);
	const relayEnviroment = useRelayEnvironment();
	const [orderBy, setOrderBy] = useState('popularity_DESC');
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [lowerValue, setLowerValue] = useState(0);
	const [upperValue, setUpperValue] = useState(5000);

	if (products.length === 0) {
		return <div>No products found</div>;
	}

	const handleCategoryFilterOpen = (id: string) => () => {
		setCurrentlyOpenedFilter(id);
	};

	const handleCategoryFilterClose = (id: string) => () => {
		setCurrentlyOpenedFilter(currentlyOpenedFilter => (currentlyOpenedFilter === id ? null : currentlyOpenedFilter));
	};

	const orderByChange = async (orderBy: string) => {
		if (
			orderBy === 'popularity_DESC' ||
			orderBy === 'created_DESC' ||
			orderBy === 'price_ASC' ||
			orderBy === 'price_DESC' ||
			orderBy === 'discount_DESC'
		) {
			setOrderBy(orderBy);
			fetchQuery<ProductListProductsQuery>(relayEnviroment, PRODUCT_LIST_PRODUCTS_QUERY, {
				where: {
					id: category.id,
				},
				orderBy,
			}).then(response => {
				const products = response.category.products?.edges.map(edge => edge.node) || [];
				setProducts(products);
			});
		}
	};

	return (
		<div>
			<FiltersContainer>
				<CategoryFilterSingleSelect
					title="Sortera på"
					items={[
						{ id: 'popularity_DESC', node: 'Popularitet' },
						{ id: 'created_DESC', node: 'Nyheter' },
						{ id: 'price_ASC', node: 'Lägsta pris' },
						{ id: 'price_DESC', node: 'Hösta pris' },
						{ id: 'discount_DESC', node: 'Högsta rabatt' },
					]}
					selectedItemId={orderBy}
					onItemSelected={itemId => {
						setOrderBy(itemId);
						orderByChange(itemId);
					}}
					open={currentlyOpenedFilter === 'order'}
					onOpenRequest={handleCategoryFilterOpen('order')}
					onCloseRequest={handleCategoryFilterClose('order')}
				/>
				<CategoryFilterMultiSelect
					title="Märke"
					items={[
						{ id: '0', node: 'Adidas' },
						{ id: '1', node: 'Nike' },
						{ id: '2', node: 'Whatever' },
						{ id: '3', node: 'Floats' },
						{ id: '4', node: 'Your' },
						{ id: '5', node: 'Boat' },
					]}
					selectedItemIds={selectedItems}
					onItemSelected={itemId => {
						setSelectedItems(items => [...items, itemId]);
					}}
					onItemUnselected={itemId => {
						setSelectedItems(items => items.filter(item => item !== itemId));
					}}
					open={currentlyOpenedFilter === 'brand'}
					onOpenRequest={handleCategoryFilterOpen('brand')}
					onCloseRequest={handleCategoryFilterClose('brand')}
				/>
				<CategoryFilterRangeSelect
					title="Pris"
					min={117}
					max={1746}
					lowerValue={lowerValue}
					upperValue={upperValue}
					onLowerValueChange={newFrom => {
						setLowerValue(newFrom);
					}}
					onUpperValueChange={newTo => {
						setUpperValue(newTo);
					}}
					open={currentlyOpenedFilter === 'price'}
					onOpenRequest={handleCategoryFilterOpen('price')}
					onCloseRequest={handleCategoryFilterClose('price')}
				/>
			</FiltersContainer>
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
