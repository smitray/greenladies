import React from 'react';

import { useRouter } from 'next/router';
import { stringify } from 'query-string';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { useDidUpdateEffect } from '../../hooks/use-did-update-effect';
import { colorCodeToDisplay } from '../../utils/products-filtering-and-ordering';
import { ProductFilters } from '../ProductFilters';
import { ProductGrid } from '../ProductGrid';
import { ProductSelectedFilters } from '../ProductSelectedFilters';

import { ProductsWithFilters_products } from './__generated__/ProductsWithFilters_products.graphql';

interface SelectedFilter {
	filter: string;
	code: string;
	display: string;
}

type OrderBy = 'created_DESC' | 'price_ASC' | 'price_DESC' | 'discount_DESC';

const parseOrderBy = (orderBy: any): OrderBy => {
	if (orderBy === 'created_DESC') {
		return 'created_DESC';
	}

	if (orderBy === 'price_ASC') {
		return 'price_ASC';
	}

	if (orderBy === 'price_DESC') {
		return 'price_DESC';
	}

	if (orderBy === 'discount_DESC') {
		return 'discount_DESC';
	}

	return 'created_DESC';
};

interface ProductsWithFiltersViewProps {
	products: ProductsWithFilters_products;
	selectedOrderBy: OrderBy;
	selectedBrands: string[];
	selectedSizes: string[];
	selectedColors: string[];
	selectedLowerPrice: number | null;
	selectedUpperPrice: number | null;
	setSelectedOrderBy: React.Dispatch<React.SetStateAction<OrderBy>>;
	setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
	setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
	setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
	setSelectedLowerPrice: React.Dispatch<React.SetStateAction<number | null>>;
	setSelectedUpperPrice: React.Dispatch<React.SetStateAction<number | null>>;
	selectedFilters: SelectedFilter[];
	setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilter[]>>;
}

const ProductsWithFiltersView = ({
	products,
	selectedOrderBy,
	selectedBrands,
	selectedSizes,
	selectedColors,
	selectedLowerPrice,
	selectedUpperPrice,
	setSelectedOrderBy,
	setSelectedBrands,
	setSelectedSizes,
	setSelectedColors,
	setSelectedLowerPrice,
	setSelectedUpperPrice,
	selectedFilters,
	setSelectedFilters,
}: ProductsWithFiltersViewProps) => {
	const router = useRouter();

	useDidUpdateEffect(() => {
		const query: Record<string, any> = {
			orderBy: selectedOrderBy,
		};

		if (selectedBrands.length > 0) {
			query.brands = selectedBrands.join(',');
		}

		if (selectedSizes.length > 0) {
			query.sizes = selectedSizes.join(',');
		}

		if (selectedColors.length > 0) {
			query.colors = selectedColors.join(',');
		}

		if (selectedLowerPrice !== null || selectedUpperPrice !== null) {
			query.price = `${selectedLowerPrice !== null ? selectedLowerPrice : ''}-${
				selectedUpperPrice !== null ? selectedUpperPrice : ''
			}`;
		}

		router.replace(`${router.pathname}?${stringify(query)}`, `${router.asPath.split('?')[0]}?${stringify(query)}`);
	}, [selectedOrderBy, selectedBrands, selectedSizes, selectedColors, selectedUpperPrice, selectedLowerPrice]);

	const ProductFiltersWrapper = styled.div`
		display: none;

		@media (min-width: 641px) {
			display: block;
		}
	`;

	return (
		<React.Fragment>
			<ProductFiltersWrapper>
				<ProductFilters
					products={products}
					selectedOrderBy={selectedOrderBy}
					selectedBrands={selectedBrands}
					selectedSizes={selectedSizes}
					selectedColors={selectedColors}
					selectedUpperPrice={selectedUpperPrice}
					selectedLowerPrice={selectedLowerPrice}
					onOrderBySelect={newOrderBy => {
						setSelectedOrderBy(parseOrderBy(newOrderBy));
					}}
					onBrandSelect={brand => {
						setSelectedBrands(prevSelectedBrands => prevSelectedBrands.concat(brand));
						setSelectedFilters(prevSelectedFilters =>
							prevSelectedFilters.concat({
								filter: 'brand',
								code: brand,
								display: brand,
							}),
						);
					}}
					onBrandDeselect={brand => {
						setSelectedBrands(prevSelectedBrands =>
							prevSelectedBrands.filter(prevSelectedBrand => prevSelectedBrand !== brand),
						);
						setSelectedFilters(prevSelectedFilters =>
							prevSelectedFilters.filter(
								selectedFilter => !(selectedFilter.filter === 'brand' && selectedFilter.code === brand),
							),
						);
					}}
					onSizeSelect={size => {
						setSelectedSizes(prevSelectedSizes => prevSelectedSizes.concat(size));
						setSelectedFilters(prevSelectedFilters =>
							prevSelectedFilters.concat({
								filter: 'size',
								code: size,
								display: size,
							}),
						);
					}}
					onSizeDeselect={size => {
						setSelectedSizes(prevSelectedSizes =>
							prevSelectedSizes.filter(prevSelectedSize => prevSelectedSize !== size),
						);
						setSelectedFilters(prevSelectedFilters =>
							prevSelectedFilters.filter(
								selectedFilter => !(selectedFilter.filter === 'size' && selectedFilter.code === size),
							),
						);
					}}
					onColorSelect={color => {
						setSelectedColors(prevSelectedColors => prevSelectedColors.concat(color));
						setSelectedFilters(prevSelectedFilters =>
							prevSelectedFilters.concat({
								filter: 'color',
								code: color,
								display: colorCodeToDisplay(color),
							}),
						);
					}}
					onColorDeselect={color => {
						setSelectedColors(prevSelectedColors =>
							prevSelectedColors.filter(prevSelectedColor => prevSelectedColor !== color),
						);
						setSelectedFilters(prevSelectedFilters =>
							prevSelectedFilters.filter(
								selectedFilter => !(selectedFilter.filter === 'color' && selectedFilter.code === color),
							),
						);
					}}
					onLowerPriceSelect={newLowerPrice => {
						setSelectedLowerPrice(newLowerPrice);
						setSelectedFilters(prevSelectedFilters => {
							const index = prevSelectedFilters.findIndex(prevSelectedFilter => prevSelectedFilter.filter === 'price');
							if (index === -1) {
								return [
									...prevSelectedFilters,
									{
										filter: 'price',
										code: 'price',
										display: `${newLowerPrice} kr -`,
									},
								];
							} else {
								return [
									...prevSelectedFilters.slice(0, index),
									{
										filter: 'price',
										code: 'price',
										display: `${newLowerPrice} kr -${selectedUpperPrice !== null ? ` ${selectedUpperPrice} kr` : ''}`,
									},
									...prevSelectedFilters.slice(index + 1),
								];
							}
						});
					}}
					onLowerPriceDeselect={() => {
						setSelectedLowerPrice(null);
						setSelectedFilters(prevSelectedFilters => {
							if (selectedUpperPrice === null) {
								return prevSelectedFilters.filter(prevSelectedFilter => prevSelectedFilter.filter !== 'price');
							}

							return prevSelectedFilters.map(prevSelectedFilter => {
								if (prevSelectedFilter.filter === 'price') {
									return {
										filter: 'price',
										code: 'price',
										display: `- ${selectedUpperPrice} kr`,
									};
								}

								return prevSelectedFilter;
							});
						});
					}}
					onUpperPriceSelect={newUpperPrice => {
						setSelectedUpperPrice(newUpperPrice);
						setSelectedFilters(prevSelectedFilters => {
							const index = prevSelectedFilters.findIndex(prevSelectedFilter => prevSelectedFilter.filter === 'price');
							if (index === -1) {
								return [
									...prevSelectedFilters,
									{
										filter: 'price',
										code: 'price',
										display: `- ${newUpperPrice} kr `,
									},
								];
							} else {
								return [
									...prevSelectedFilters.slice(0, index),
									{
										filter: 'price',
										code: 'price',
										display: `${selectedLowerPrice !== null ? `${selectedLowerPrice} kr ` : ''}- ${newUpperPrice} kr`,
									},
									...prevSelectedFilters.slice(index + 1),
								];
							}
						});
					}}
					onUpperPriceDeselect={() => {
						setSelectedUpperPrice(null);
						setSelectedFilters(prevSelectedFilters => {
							if (selectedLowerPrice === null) {
								return prevSelectedFilters.filter(prevSelectedFilter => prevSelectedFilter.filter !== 'price');
							}

							return prevSelectedFilters.map(prevSelectedFilter => {
								if (prevSelectedFilter.filter === 'price') {
									return {
										filter: 'price',
										code: 'price',
										display: `${selectedLowerPrice} kr -`,
									};
								}

								return prevSelectedFilter;
							});
						});
					}}
				/>
			</ProductFiltersWrapper>
			<ProductSelectedFilters
				selectedFilters={selectedFilters}
				onFilterRemove={(filter, code) => {
					switch (filter) {
						case 'brand':
							setSelectedFilters(prevSelectedFilters =>
								prevSelectedFilters.filter(
									prevSelectedFilter => !(prevSelectedFilter.filter === 'brand' && prevSelectedFilter.code === code),
								),
							);
							setSelectedBrands(prevSelectedBrands =>
								prevSelectedBrands.filter(prevSelectedBrand => prevSelectedBrand !== code),
							);
							break;
						case 'size':
							setSelectedFilters(prevSelectedFilters =>
								prevSelectedFilters.filter(
									prevSelectedFilter => !(prevSelectedFilter.filter === 'size' && prevSelectedFilter.code === code),
								),
							);
							setSelectedSizes(prevSelectedSizes =>
								prevSelectedSizes.filter(prevSelectedSize => prevSelectedSize !== code),
							);
							break;
						case 'color':
							setSelectedFilters(prevSelectedFilters =>
								prevSelectedFilters.filter(
									prevSelectedFilter => !(prevSelectedFilter.filter === 'color' && prevSelectedFilter.code === code),
								),
							);
							setSelectedColors(prevSelectedColors =>
								prevSelectedColors.filter(prevSelectedColor => prevSelectedColor !== code),
							);
							break;
						case 'price':
							setSelectedFilters(prevSelectedFilters =>
								prevSelectedFilters.filter(prevSelectedFilter => prevSelectedFilter.filter !== 'price'),
							);
							setSelectedLowerPrice(null);
							setSelectedUpperPrice(null);
							break;
					}
				}}
				onClearFilters={() => {
					setSelectedFilters([]);
					setSelectedBrands([]);
					setSelectedSizes([]);
					setSelectedColors([]);
					setSelectedUpperPrice(null);
					setSelectedLowerPrice(null);
				}}
			/>
			<ProductGrid products={products} />
		</React.Fragment>
	);
};

export default createFragmentContainer(ProductsWithFiltersView, {
	products: graphql`
		fragment ProductsWithFilters_products on ProductConnection
			@argumentDefinitions(filters: { type: "ProductFiltersInput" }) {
			...ProductGrid_products
			...ProductFilters_products
		}
	`,
});
