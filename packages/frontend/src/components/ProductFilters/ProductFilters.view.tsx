import React, { useState } from 'react';

import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { colorCodeToDisplay } from '../../utils/products-filtering-and-ordering';
import { CategoryFilterMultiSelect } from '../CategoryFilterMultiSelect';
import { CategoryFilterRangeSelect } from '../CategoryFilterRangeSelect';
import { CategoryFilterSingleSelect } from '../CategoryFilterSingleSelect';

import { ProductFilters_products } from './__generated__/ProductFilters_products.graphql';

const FiltersContainer = styled.ul`
	display: flex;
	margin: 0 0 12px 0;
	padding: 0;
	list-style: none;
`;

interface ColorSquareProps {
	color: string;
}

const ColorSquare = styled.div<ColorSquareProps>`
	margin-right: 4px;
	height: 14px;
	width: 14px;
	background: ${({ color }) => color};
`;

function colorCodeToSquare(code: string) {
	switch (code) {
		case 'beige':
			return <ColorSquare color="beige" />;
		case 'black':
			return <ColorSquare color="black" />;
		case 'blue':
			return <ColorSquare color="blue" />;
		case 'brown':
			return <ColorSquare color="brown" />;
		case 'darkgreen':
			return <ColorSquare color="darkgreen" />;
		case 'gold':
			return <ColorSquare color="gold" />;
		case 'green':
			return <ColorSquare color="green" />;
		case 'grey':
			return <ColorSquare color="grey" />;
		case 'multi':
			return (
				<div style={{ width: '14px', height: '14px', marginRight: '4px', display: 'flex', flexWrap: 'wrap' }}>
					<div style={{ width: '7px', height: '7px', background: 'red' }}></div>
					<div style={{ width: '7px', height: '7px', background: 'green' }}></div>
					<div style={{ width: '7px', height: '7px', background: 'blue' }}></div>
					<div style={{ width: '7px', height: '7px', background: 'yellow' }}></div>
				</div>
			);
		case 'orange':
			return <ColorSquare color="orange" />;
		case 'pink':
			return <ColorSquare color="pink" />;
		case 'purple':
			return <ColorSquare color="purple" />;
		case 'red':
			return <ColorSquare color="red" />;
		case 'silver':
			return <ColorSquare color="silver" />;
		case 'white':
			return <ColorSquare color="white" />;
		case 'yellow':
			return <ColorSquare color="yellow" />;
		default:
			return <ColorSquare color="white" />;
	}
}

interface ProductFiltersViewProps {
	products: ProductFilters_products;
	selectedOrderBy: string;
	selectedBrands: string[];
	selectedSizes: string[];
	selectedColors: string[];
	selectedUpperPrice: number | null;
	selectedLowerPrice: number | null;
	onOrderBySelect: (orderBy: string) => void;
	onBrandSelect: (brand: string) => void;
	onBrandDeselect: (brand: string) => void;
	onSizeSelect: (size: string) => void;
	onSizeDeselect: (size: string) => void;
	onColorSelect: (color: string) => void;
	onColorDeselect: (color: string) => void;
	onLowerPriceSelect: (price: number) => void;
	onLowerPriceDeselect: () => void;
	onUpperPriceSelect: (price: number) => void;
	onUpperPriceDeselect: () => void;
}

const ProductFiltersView = ({
	products,
	selectedOrderBy,
	selectedBrands,
	selectedSizes,
	selectedColors,
	selectedUpperPrice,
	selectedLowerPrice,
	onOrderBySelect,
	onBrandSelect,
	onBrandDeselect,
	onSizeSelect,
	onSizeDeselect,
	onColorSelect,
	onColorDeselect,
	onLowerPriceSelect,
	onLowerPriceDeselect,
	onUpperPriceSelect,
	onUpperPriceDeselect,
}: ProductFiltersViewProps) => {
	const [currentlyOpenedFilter, setCurrentlyOpenedFilter] = useState<string | null>(null);

	const handleCategoryFilterOpen = (id: string) => () => {
		setCurrentlyOpenedFilter(id);
	};

	const handleCategoryFilterClose = (id: string) => () => {
		setCurrentlyOpenedFilter(currentlyOpenedFilter => (currentlyOpenedFilter === id ? null : currentlyOpenedFilter));
	};

	return (
		<div>
			<FiltersContainer>
				<CategoryFilterSingleSelect
					title="Sortera på"
					items={[
						{ id: 'created_DESC', node: 'Nyheter' },
						{ id: 'price_ASC', node: 'Lägsta pris' },
						{ id: 'price_DESC', node: 'Hösta pris' },
						{ id: 'discount_DESC', node: 'Högsta rabatt' },
					]}
					selectedItemId={selectedOrderBy}
					onItemSelected={itemId => onOrderBySelect(itemId)}
					open={currentlyOpenedFilter === 'order'}
					onOpenRequest={handleCategoryFilterOpen('order')}
					onCloseRequest={handleCategoryFilterClose('order')}
				/>
				<CategoryFilterMultiSelect
					title="Märke"
					items={products.availableFilters.brands.map(brand => ({
						id: brand,
						node: <div>{brand}</div>,
					}))}
					selectedItemIds={selectedBrands}
					onItemSelected={itemId => onBrandSelect(itemId)}
					onItemUnselected={itemId => onBrandDeselect(itemId)}
					open={currentlyOpenedFilter === 'brand'}
					onOpenRequest={handleCategoryFilterOpen('brand')}
					onCloseRequest={handleCategoryFilterClose('brand')}
				/>
				<CategoryFilterMultiSelect
					title="Storlek"
					items={products.availableFilters.sizes.map(size => ({
						id: size,
						node: <div>{size}</div>,
					}))}
					selectedItemIds={selectedSizes}
					onItemSelected={itemId => onSizeSelect(itemId)}
					onItemUnselected={itemId => onSizeDeselect(itemId)}
					open={currentlyOpenedFilter === 'size'}
					onOpenRequest={handleCategoryFilterOpen('size')}
					onCloseRequest={handleCategoryFilterClose('size')}
				/>
				<CategoryFilterMultiSelect
					title="Färg"
					items={products.availableFilters.colors.map(color => ({
						id: color,
						node: (
							<div style={{ display: 'flex', alignItems: 'center' }}>
								{colorCodeToSquare(color)}
								{colorCodeToDisplay(color)}
							</div>
						),
					}))}
					selectedItemIds={selectedColors}
					onItemSelected={itemId => onColorSelect(itemId)}
					onItemUnselected={itemId => onColorDeselect(itemId)}
					open={currentlyOpenedFilter === 'color'}
					onOpenRequest={handleCategoryFilterOpen('color')}
					onCloseRequest={handleCategoryFilterClose('color')}
				/>
				<CategoryFilterRangeSelect
					title="Pris"
					min={products.availableFilters.price.from}
					max={products.availableFilters.price.to}
					lowerValue={selectedLowerPrice || products.availableFilters.price.from}
					upperValue={selectedUpperPrice || products.availableFilters.price.to}
					onLowerValueChange={newLowerValue => {
						if (newLowerValue === products.availableFilters.price.from) {
							onLowerPriceDeselect();
						} else {
							onLowerPriceSelect(newLowerValue);
						}
					}}
					onUpperValueChange={newUpperValue => {
						if (newUpperValue === products.availableFilters.price.to) {
							onUpperPriceDeselect();
						} else {
							onUpperPriceSelect(newUpperValue);
						}
					}}
					open={currentlyOpenedFilter === 'price'}
					onOpenRequest={handleCategoryFilterOpen('price')}
					onCloseRequest={handleCategoryFilterClose('price')}
				/>
			</FiltersContainer>
		</div>
	);
};

export default createFragmentContainer(ProductFiltersView, {
	products: graphql`
		fragment ProductFilters_products on ProductConnection {
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
	`,
});
