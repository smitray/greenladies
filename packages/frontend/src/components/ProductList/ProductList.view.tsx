import React, { useState } from 'react';

import { createFragmentContainer, fetchQuery, graphql } from 'react-relay';
import styled from 'styled-components';

import { useRelayEnvironment } from '../../lib/relay-environment';
import { CategoryFilterMultiSelect } from '../CategoryFilterMultiSelect';
import { CategoryFilterRangeSelect } from '../CategoryFilterRangeSelect';
import { CategoryFilterSingleSelect } from '../CategoryFilterSingleSelect';
import { ProductCard } from '../ProductCard';

import { ProductList_category } from './__generated__/ProductList_category.graphql';
import {
	ProductListProductsQuery,
	ProductListProductsQueryResponse,
} from './__generated__/ProductListProductsQuery.graphql';

const PRODUCT_LIST_PRODUCTS_QUERY = graphql`
	query ProductListProductsQuery($where: CategoryWhereUniqueInput!, $orderBy: OrderProducts, $filter: FilterProducts) {
		category(where: $where) {
			id
			products(orderBy: $orderBy, filter: $filter) {
				edges {
					node {
						id
						...ProductCard_product
					}
				}
				filterValues {
					price {
						min
						max
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

const ProductListView: React.FC<Props> = ({ category: c }) => {
	const [category, setCategory] = useState<ProductListProductsQueryResponse['category']>(c);
	const [currentlyOpenedFilter, setCurrentlyOpenedFilter] = useState<string | null>(null);
	const relayEnviroment = useRelayEnvironment();

	const [orderBy, setOrderBy] = useState('popularity_DESC');
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [lowerValue, setLowerValue] = useState(category.products?.filterValues.price.min || 0);
	const [upperValue, setUpperValue] = useState(category.products?.filterValues.price.max || 100);

	const handleCategoryFilterOpen = (id: string) => () => {
		setCurrentlyOpenedFilter(id);
	};

	const handleCategoryFilterClose = (id: string) => () => {
		setCurrentlyOpenedFilter(currentlyOpenedFilter => (currentlyOpenedFilter === id ? null : currentlyOpenedFilter));
	};

	const handleFilterUpdate = async (orderBy: string, lowerPrice: number, upperPrice: number) => {
		if (
			orderBy !== 'popularity_DESC' &&
			orderBy !== 'created_DESC' &&
			orderBy !== 'price_ASC' &&
			orderBy !== 'price_DESC' &&
			orderBy !== 'discount_DESC'
		) {
			return;
		}

		const response = await fetchQuery<ProductListProductsQuery>(relayEnviroment, PRODUCT_LIST_PRODUCTS_QUERY, {
			where: {
				id: category.id,
			},
			orderBy,
			filter: {
				price_between: {
					min: lowerPrice,
					max: upperPrice,
				},
			},
		});

		setCategory(response.category);
		const { products } = response.category;
		if (products) {
			if (products.filterValues.price.min > lowerValue) {
				setLowerValue(products.filterValues.price.min);
			}

			if (products.filterValues.price.max < upperValue) {
				setUpperValue(products.filterValues.price.max);
			}
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
						handleFilterUpdate(itemId, lowerValue, upperValue);
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
					min={category.products.filterValues.price.min}
					max={category.products.filterValues.price.max}
					lowerValue={lowerValue}
					upperValue={upperValue}
					onLowerValueChange={newLowerValue => {
						setLowerValue(newLowerValue);
						handleFilterUpdate(orderBy, newLowerValue, upperValue);
					}}
					onUpperValueChange={newUpperValue => {
						setUpperValue(newUpperValue);
						handleFilterUpdate(orderBy, lowerValue, newUpperValue);
					}}
					open={currentlyOpenedFilter === 'price'}
					onOpenRequest={handleCategoryFilterOpen('price')}
					onCloseRequest={handleCategoryFilterClose('price')}
				/>
			</FiltersContainer>
			{category.products.edges.length > 0 && (
				<div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
					{category.products.edges.map(({ node: product }) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
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
				filterValues {
					price {
						min
						max
					}
				}
			}
		}
	`,
});
