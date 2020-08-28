import React, { useEffect, useState } from 'react';

import { FaTimes, FaTrashAlt } from 'react-icons/fa';
import { createFragmentContainer, fetchQuery, graphql } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';
import styled from 'styled-components';

import { useClearWishlistMutation } from '../../mutations/wishlist';
import { CategoryFilterMultiSelect } from '../CategoryFilterMultiSelect';
import { CategoryFilterRangeSelect } from '../CategoryFilterRangeSelect';
import { CategoryFilterSingleSelect } from '../CategoryFilterSingleSelect';
import { ProductCard } from '../ProductCard';

import { ProductList_category } from './__generated__/ProductList_category.graphql';
import { ProductListProductsQuery } from './__generated__/ProductListProductsQuery.graphql';

const PRODUCT_LIST_PRODUCTS_QUERY = graphql`
	query ProductListProductsQuery(
		$where: CategoryWhereUniqueInput!
		$orderBy: OrderProductsInput
		$filters: ProductFiltersInput
	) {
		category(where: $where) {
			id
			products(orderBy: $orderBy, filters: $filters) {
				edges {
					node {
						id
						...ProductCard_product
					}
				}
				availableFilters {
					brands
					colors
					price {
						from
						to
					}
					sizes
				}
			}
		}
	}
`;

const FiltersContainer = styled.ul`
	display: flex;
	margin: 0 0 12px 0;
	padding: 0;
	list-style: none;
`;

const RemoveFilterButton = styled.button`
	outline: none;
	padding: 8px 24px 8px 8px;
	background: white;
	border: 1px solid #e6e6e6;
	cursor: pointer;
	margin-right: 4px;
	position: relative;

	&:hover {
		background: #e6e6e6;
	}
`;

function colorCodeToHex(code: string) {
	switch (code) {
		case 'black':
			return 'black';
		case 'darkgreen':
			return 'darkgreen';
		case 'blue':
			return 'blue';
		default:
			return 'white';
	}
}
function colorCodeToDisplay(code: string) {
	switch (code) {
		case 'black':
			return 'Svart';
		case 'darkgreen':
			return 'Mörkgrön';
		case 'blue':
			return 'Blå';
		default:
			return 'Vit';
	}
}

interface Props {
	category: ProductList_category;
}

const ProductListView: React.FC<Props> = ({ category }) => {
	const [products, setProducts] = useState(category.products.edges.map(edge => edge.node));
	const [availableFilters, setAvailableFilters] = useState(category.products.availableFilters);
	const [currentlyOpenedFilter, setCurrentlyOpenedFilter] = useState<string | null>(null);
	const relayEnviroment = useRelayEnvironment();

	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [selectedColors, setSelectedColors] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
	const [lowerPrice, setLowerPrice] = useState(category.products.availableFilters.price.from);
	const [upperPrice, setUpperPrice] = useState(category.products.availableFilters.price.to);

	const [orderBy, setOrderBy] = useState('popularity_DESC');

	const [selectedFilters, setSelectedFilters] = useState<{ filter: string; code: string; display: string }[]>([]);

	const { commit: clearWishlist } = useClearWishlistMutation();

	const handleCategoryFilterOpen = (id: string) => () => {
		setCurrentlyOpenedFilter(id);
	};

	const handleCategoryFilterClose = (id: string) => () => {
		setCurrentlyOpenedFilter(currentlyOpenedFilter => (currentlyOpenedFilter === id ? null : currentlyOpenedFilter));
	};

	useEffect(() => {
		const asyncEffect = async () => {
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
				filters: {
					brand_in: selectedBrands.length === 0 ? undefined : selectedBrands,
					color_in: selectedColors.length === 0 ? undefined : selectedColors,
					price_between: {
						from: lowerPrice,
						to: upperPrice,
					},
					size_in: selectedSizes.length === 0 ? undefined : selectedSizes,
				},
			});

			setProducts(response.category.products.edges.map(edge => edge.node));
			setAvailableFilters(response.category.products.availableFilters);
			if (response.category.products.availableFilters.price.from < lowerPrice) {
				setLowerPrice(response.category.products.availableFilters.price.from);
			}

			if (response.category.products.availableFilters.price.to > upperPrice) {
				setUpperPrice(response.category.products.availableFilters.price.to);
			}
		};

		asyncEffect();
	}, [category.id, lowerPrice, orderBy, relayEnviroment, selectedBrands, selectedColors, selectedSizes, upperPrice]);

	return (
		<div>
			<button onClick={() => clearWishlist()}>REMOVE ALL</button>
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
					}}
					open={currentlyOpenedFilter === 'order'}
					onOpenRequest={handleCategoryFilterOpen('order')}
					onCloseRequest={handleCategoryFilterClose('order')}
				/>
				<CategoryFilterMultiSelect
					title="Märke"
					items={availableFilters.brands.map(brand => ({
						id: brand,
						node: <div>{brand}</div>,
					}))}
					selectedItemIds={selectedBrands}
					onItemSelected={itemId => {
						setSelectedBrands(selectedBrands => [...selectedBrands, itemId]);
						setSelectedFilters(selectedFilters => [
							...selectedFilters,
							{
								filter: 'brand',
								code: itemId,
								display: itemId,
							},
						]);
					}}
					onItemUnselected={itemId => {
						setSelectedBrands(selectedBrands => selectedBrands.filter(selectedBrand => selectedBrand !== itemId));
						setSelectedFilters(selectedFilters =>
							selectedFilters.filter(
								selectedFilter => !(selectedFilter.filter === 'brand' && selectedFilter.code === itemId),
							),
						);
					}}
					open={currentlyOpenedFilter === 'brand'}
					onOpenRequest={handleCategoryFilterOpen('brand')}
					onCloseRequest={handleCategoryFilterClose('brand')}
				/>
				<CategoryFilterMultiSelect
					title="Storlek"
					items={availableFilters.sizes.map(size => ({
						id: size,
						node: <div>{size}</div>,
					}))}
					selectedItemIds={selectedSizes}
					onItemSelected={itemId => {
						setSelectedSizes(selectedSizes => [...selectedSizes, itemId]);
						setSelectedFilters(selectedFilters => [
							...selectedFilters,
							{
								filter: 'size',
								code: itemId,
								display: itemId,
							},
						]);
					}}
					onItemUnselected={itemId => {
						setSelectedSizes(selectedSizes => selectedSizes.filter(selectedSize => selectedSize !== itemId));
						setSelectedFilters(selectedFilters =>
							selectedFilters.filter(
								selectedFilter => !(selectedFilter.filter === 'size' && selectedFilter.code === itemId),
							),
						);
					}}
					open={currentlyOpenedFilter === 'size'}
					onOpenRequest={handleCategoryFilterOpen('size')}
					onCloseRequest={handleCategoryFilterClose('size')}
				/>
				<CategoryFilterMultiSelect
					title="Färg"
					items={availableFilters.colors.map(color => ({
						id: color,
						node: (
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div
									style={{ marginRight: '4px', height: '14px', width: '14px', background: colorCodeToHex(color) }}
								></div>
								{colorCodeToDisplay(color)}
							</div>
						),
					}))}
					selectedItemIds={selectedColors}
					onItemSelected={itemId => {
						setSelectedColors(selectedColors => [...selectedColors, itemId]);
						setSelectedFilters(selectedFilters => [
							...selectedFilters,
							{
								filter: 'color',
								code: itemId,
								display: colorCodeToDisplay(itemId),
							},
						]);
					}}
					onItemUnselected={itemId => {
						setSelectedColors(selectedColors => selectedColors.filter(selectedColor => selectedColor !== itemId));
						setSelectedFilters(selectedFilters =>
							selectedFilters.filter(
								selectedFilter => !(selectedFilter.filter === 'color' && selectedFilter.code === itemId),
							),
						);
					}}
					open={currentlyOpenedFilter === 'color'}
					onOpenRequest={handleCategoryFilterOpen('color')}
					onCloseRequest={handleCategoryFilterClose('color')}
				/>
				<CategoryFilterRangeSelect
					title="Pris"
					min={availableFilters.price.from}
					max={availableFilters.price.to}
					lowerValue={lowerPrice}
					upperValue={upperPrice}
					onLowerValueChange={newLowerValue => {
						setLowerPrice(newLowerValue);
					}}
					onUpperValueChange={newUpperValue => {
						setUpperPrice(newUpperValue);
					}}
					open={currentlyOpenedFilter === 'price'}
					onOpenRequest={handleCategoryFilterOpen('price')}
					onCloseRequest={handleCategoryFilterClose('price')}
				/>
			</FiltersContainer>
			{selectedFilters.length > 0 && (
				<FiltersContainer>
					<RemoveFilterButton
						onClick={() => {
							setSelectedFilters([]);
							setSelectedBrands([]);
							setSelectedColors([]);
							setSelectedSizes([]);
							setLowerPrice(availableFilters.price.from);
							setUpperPrice(availableFilters.price.to);
						}}
					>
						Ta bort filter
						<div
							style={{
								position: 'absolute',
								top: '0',
								bottom: '0',
								right: '4px',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<div style={{ width: '16px', height: '16px' }}>
								<FaTrashAlt size="16" />
							</div>
						</div>
					</RemoveFilterButton>
					{selectedFilters.map((selectedFilter, index) => (
						<RemoveFilterButton
							key={index}
							onClick={() => {
								switch (selectedFilter.filter) {
									case 'brand':
										setSelectedBrands(selectedBrands =>
											selectedBrands.filter(selectedBrand => selectedBrand !== selectedFilter.code),
										);
										setSelectedFilters(selectedFilters =>
											selectedFilters.filter(
												({ filter, code }) => !(filter === 'brand' && code === selectedFilter.code),
											),
										);
										break;
									case 'color':
										setSelectedColors(selectedColors =>
											selectedColors.filter(selectedColor => selectedColor !== selectedFilter.code),
										);
										setSelectedFilters(selectedFilters =>
											selectedFilters.filter(
												({ filter, code }) => !(filter === 'color' && code === selectedFilter.code),
											),
										);
										break;
									case 'size':
										setSelectedSizes(selectedSizes =>
											selectedSizes.filter(selectedSize => selectedSize !== selectedFilter.code),
										);
										setSelectedFilters(selectedFilters =>
											selectedFilters.filter(
												({ filter, code }) => !(filter === 'size' && code === selectedFilter.code),
											),
										);
										break;
									case 'price':
										break;
								}
							}}
						>
							{selectedFilter.display}
							<div
								style={{
									position: 'absolute',
									top: '0',
									bottom: '0',
									right: '4px',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<div style={{ width: '16px', height: '16px' }}>
									<FaTimes size="16" />
								</div>
							</div>
						</RemoveFilterButton>
					))}
				</FiltersContainer>
			)}
			{products.length > 0 && (
				<div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
					{products.map(product => (
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
				availableFilters {
					brands
					colors
					price {
						from
						to
					}
					sizes
				}
			}
		}
	`,
});
