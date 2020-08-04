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
	const [open, setOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState('popularity_DESC');
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(5000);

	if (products.length === 0) {
		return <div>No products found</div>;
	}

	const handleCategoryFilterClick = (id: string) => () => {
		setCurrentlyOpenedFilter(currentlyOpenedFilter => (currentlyOpenedFilter === id ? null : id));
	};

	const handleCategoryClickOutside = (id: string) => () => {
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
					open={open}
					title="Sortera på"
					items={[
						{ id: 'popularity_DESC', node: 'Popularitet' },
						{ id: 'created_DESC', node: 'Nyheter' },
						{ id: 'price_ASC', node: 'Lägsta pris' },
						{ id: 'price_DESC', node: 'Hösta pris' },
						{ id: 'discount_DESC', node: 'Högsta rabatt' },
					]}
					selectedItemId={selectedItem}
					onItemSelected={itemId => {
						setSelectedItem(itemId);
					}}
					onOpenRequest={() => setOpen(true)}
					onCloseRequest={() => setOpen(false)}
				/>
				<CategoryFilterMultiSelect
					open={open2}
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
					onOpenRequest={() => setOpen2(true)}
					onCloseRequest={() => setOpen2(false)}
				/>
				<CategoryFilterRangeSelect
					open={open3}
					title="Pris"
					onOpenRequest={() => setOpen3(true)}
					onCloseRequest={() => setOpen3(false)}
					min={117}
					max={1746}
					from={from}
					to={to}
					onFromChange={newFrom => {
						setFrom(newFrom);
						console.log('new from', newFrom);
					}}
					onToChange={newTo => setTo(newTo)}
				/>
				{/*<CategoryFilter
					title="Sortera på"
					open={currentlyOpenedFilter === 'sort'}
					onClick={handleCategoryFilterClick('sort')}
					onClickOutside={handleCategoryClickOutside('sort')}
				>
					<SingleSelectList />
					<div
						style={{
							textDecoration: orderBy === 'popularity_DESC' ? 'underline' : 'none',
							fontWeight: orderBy === 'popularity_DESC' ? 'bold' : 'normal',
						}}
						onClick={() => orderByChange('popularity_DESC')}
					>
						Popularitet
					</div>
					<div
						style={{
							textDecoration: orderBy === 'created_DESC' ? 'underline' : 'none',
							fontWeight: orderBy === 'created_DESC' ? 'bold' : 'normal',
						}}
						onClick={() => orderByChange('created_DESC')}
					>
						Nyheter
					</div>
					<div
						style={{
							textDecoration: orderBy === 'price_ASC' ? 'underline' : 'none',
							fontWeight: orderBy === 'price_ASC' ? 'bold' : 'normal',
						}}
						onClick={() => orderByChange('price_ASC')}
					>
						Lägst pris
					</div>
					<div
						style={{
							textDecoration: orderBy === 'price_DESC' ? 'underline' : 'none',
							fontWeight: orderBy === 'price_DESC' ? 'bold' : 'normal',
						}}
						onClick={() => orderByChange('price_DESC')}
					>
						Högst pris
					</div>
					<div
						style={{
							textDecoration: orderBy === 'discount_DESC' ? 'underline' : 'none',
							fontWeight: orderBy === 'discount_DESC' ? 'bold' : 'normal',
						}}
						onClick={() => orderByChange('discount_DESC')}
					>
						Högst rabatt
					</div>
				</CategoryFilter>
				<CategoryFilter
					title="Storlek"
					open={currentlyOpenedFilter === 'size'}
					onClick={handleCategoryFilterClick('size')}
					onClickOutside={handleCategoryClickOutside('size')}
				>
					<MultiSelectList />
					<div>size</div>
				</CategoryFilter>
				<CategoryFilter
					title="Märke"
					open={currentlyOpenedFilter === 'brand'}
					onClick={handleCategoryFilterClick('brand')}
					onClickOutside={handleCategoryClickOutside('brand')}
				>
					<MultiSelectList />
					<div>brand</div>
				</CategoryFilter>
				<CategoryFilter
					title="Färg"
					open={currentlyOpenedFilter === 'colour'}
					onClick={handleCategoryFilterClick('colour')}
					onClickOutside={handleCategoryClickOutside('colour')}
				>
					<MultiSelectList />
					<div>colour</div>
				</CategoryFilter>
				<CategoryFilter
					title="Pris"
					open={currentlyOpenedFilter === 'price'}
					onClick={handleCategoryFilterClick('price')}
					onClickOutside={handleCategoryClickOutside('price')}
				>
					<RangeSelect />
					<div>price</div>
				</CategoryFilter>*/}
			</FiltersContainer>
			<select
				name="sort"
				id="sort"
				onChange={e => {
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
