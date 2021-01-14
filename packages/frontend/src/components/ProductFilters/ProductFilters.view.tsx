import React, { useState } from 'react';

import Drawer from 'rc-drawer';
import { Range } from 'rc-slider';
import { FaAngleDown, FaAngleRight, FaTimes } from 'react-icons/fa';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { IconWrapper } from '../../styles/icon-wrapper';
import { colorCodeToDisplay } from '../../utils/products-filtering-and-ordering';
import { FilterMultiSelect } from '../filter/FilterMultiSelect';
import { FilterRangeSelect } from '../filter/FilterRangeSelect';
import { FilterSingleSelect } from '../filter/FilterSingleSelect';

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
		case 'copper':
			return <ColorSquare color="#b87333" />;
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
		case 'transparent':
			return <ColorSquare color="transparent" />;
		default:
			return <ColorSquare color="white" />;
	}
}

const MobileWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 1em;

	@media (min-width: 641px) {
		display: none;
	}
`;

const NotMobileWrapper = styled.div`
	display: none;

	@media (min-width: 641px) {
		display: block;
	}
`;

const Header = styled.div`
	position: relative;
	padding: 0.5em 0;
	text-align: center;
	font-size: 1.2em;
	line-height: 1.2em;
	border-bottom: 1px solid lightgrey;
`;

const ClearButton = styled.button`
	position: absolute;
	left: 0.5em;
	top: 0.25em;
	background: white;
	border: none;
	outline: none;
	padding: 0.5em;
	font-size: 0.8em;
	cursor: pointer;
`;

const CloseButton = styled.button`
	position: absolute;
	right: 0.5em;
	top: 0;
	background: white;
	border: none;
	outline: none;
	padding: 0.5em;
	font-size: 1em;
	cursor: pointer;
`;

const SaveButton = styled.div`
	width: 100%;
	padding: 1em;
	text-align: center;
	border: 2px solid black;
`;

const FilterEntry = styled.div`
	padding: 1em;
	display: flex;
	align-items: center;
	cursor: pointer;

	&:not(:last-child) {
		border-bottom: 1px solid lightgrey;
	}
`;

const FilterEntryHeader = styled.div`
	font-weight: bold;
`;

const FilterEntrySelectFiltersList = styled.div`
	font-size: 0.8em;
`;

const RangeWrapper = styled.div`
	padding: 1em;
	width: 100%;
`;

const KNOB_SIZE = 24;
const GROW_FACTOR = 1.15;

interface SliderHandleProps {
	index: number;
	offset: number;
	dragging: boolean;
}

const SliderHandle: React.FC<SliderHandleProps> = ({ index, dragging, offset }) => {
	return (
		<div
			key={index}
			style={{
				width: `${dragging ? KNOB_SIZE * GROW_FACTOR : KNOB_SIZE}px`,
				height: `${dragging ? KNOB_SIZE * GROW_FACTOR : KNOB_SIZE}px`,
				background: 'black',
				borderRadius: '100%',
				position: 'absolute',
				transform: 'translateX(-50%)',
				marginTop: `-${((dragging ? KNOB_SIZE * GROW_FACTOR : KNOB_SIZE) - 2) / 2}px`,
				left: `${offset}%`,
				transition: 'all 50ms ease -in -out',
				cursor: 'pointer',
			}}
		/>
	);
};

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
	onClearFilters: () => void;
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
	onClearFilters,
}: ProductFiltersViewProps) => {
	const [currentlyOpenedFilter, setCurrentlyOpenedFilter] = useState<string | null>(null);
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const [mobileSearchBrandsOpen, setMobileSearchBrandsOpen] = useState(false);
	const [mobileSearchColorsOpen, setMobileSearchColorsOpen] = useState(false);
	const [mobileSearchSizesOpen, setMobileSearchSizesOpen] = useState(false);

	const [lowerValueInternal, setLowerValueInternal] = useState(selectedLowerPrice);
	const [upperValueInternal, setUpperValueInternal] = useState(selectedUpperPrice);

	const handleCategoryFilterOpen = (id: string) => () => {
		setCurrentlyOpenedFilter(id);
	};

	const handleCategoryFilterClose = (id: string) => () => {
		setCurrentlyOpenedFilter(currentlyOpenedFilter => (currentlyOpenedFilter === id ? null : currentlyOpenedFilter));
	};

	return (
		<div>
			<Drawer
				open={mobileSearchOpen}
				className="mobile-filters"
				handler={null}
				height="100%"
				placement="bottom"
				level={null}
			>
				<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
					<Header>
						<ClearButton onClick={onClearFilters}>Rensa filter</ClearButton>
						Filter
						<CloseButton onClick={() => setMobileSearchOpen(false)}>
							<IconWrapper size="1em">
								<FaTimes size="1em" />
							</IconWrapper>
						</CloseButton>
					</Header>
					<div style={{ flexGrow: 1, overflowY: 'auto' }}>
						<FilterEntry onClick={() => setMobileSearchBrandsOpen(true)}>
							<div style={{ flexGrow: 1 }}>
								<FilterEntryHeader>Märke</FilterEntryHeader>
								<FilterEntrySelectFiltersList>{selectedBrands.join(', ')}</FilterEntrySelectFiltersList>
							</div>
							<IconWrapper size="16px">
								<FaAngleRight size="16px" />
							</IconWrapper>
						</FilterEntry>
						<FilterEntry onClick={() => setMobileSearchSizesOpen(true)}>
							<div style={{ flexGrow: 1 }}>
								<FilterEntryHeader>Storlek</FilterEntryHeader>
								<FilterEntrySelectFiltersList>{selectedSizes.join(', ')}</FilterEntrySelectFiltersList>
							</div>
							<IconWrapper size="16px">
								<FaAngleRight size="16px" />
							</IconWrapper>
						</FilterEntry>
						<FilterEntry onClick={() => setMobileSearchColorsOpen(true)}>
							<div style={{ flexGrow: 1 }}>
								<FilterEntryHeader>Färg</FilterEntryHeader>
								<FilterEntrySelectFiltersList>
									{selectedColors.map(color => colorCodeToDisplay(color)).join(', ')}
								</FilterEntrySelectFiltersList>
							</div>
							<IconWrapper size="16px">
								<FaAngleRight size="16px" />
							</IconWrapper>
						</FilterEntry>
						<FilterEntry style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
							<FilterEntryHeader style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
								<span>Pris</span>
								<span style={{ fontWeight: 'normal' }}>
									{lowerValueInternal || products.availableFilters.price.from} kr -{' '}
									{upperValueInternal || products.availableFilters.price.to} kr
								</span>
							</FilterEntryHeader>
							<RangeWrapper>
								<Range
									min={products.availableFilters.price.from}
									max={products.availableFilters.price.to}
									value={[
										lowerValueInternal || products.availableFilters.price.from,
										upperValueInternal || products.availableFilters.price.to,
									]}
									onChange={values => {
										const [newLowerValue, newUpperValue] = values;
										if (newLowerValue === products.availableFilters.price.from) {
											setLowerValueInternal(null);
										} else {
											setLowerValueInternal(newLowerValue);
										}

										if (newUpperValue === products.availableFilters.price.to) {
											setUpperValueInternal(null);
										} else {
											setUpperValueInternal(newUpperValue);
										}
									}}
									onAfterChange={values => {
										const [newLowerValue, newUpperValue] = values;
										if (newLowerValue !== selectedLowerPrice) {
											if (newLowerValue === products.availableFilters.price.from) {
												onLowerPriceDeselect();
											} else {
												onLowerPriceSelect(newLowerValue);
											}
										}

										if (newUpperValue !== selectedUpperPrice) {
											if (newUpperValue === products.availableFilters.price.to) {
												onUpperPriceDeselect();
											} else {
												onUpperPriceSelect(newUpperValue);
											}
										}
									}}
									pushable
									railStyle={{ background: '#eaeaea' }}
									trackStyle={[{ background: 'black' }]}
									handle={SliderHandle}
								/>
							</RangeWrapper>
						</FilterEntry>
					</div>
					<SaveButton onClick={() => setMobileSearchOpen(false)}>Visa alla resultat</SaveButton>
					<Drawer open={mobileSearchBrandsOpen} handler={null} width="100%" placement="left" level={null}>
						<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
							<Header>
								Välj märken
								<CloseButton onClick={() => setMobileSearchBrandsOpen(false)}>
									<IconWrapper size="1em">
										<FaTimes size="1em" />
									</IconWrapper>
								</CloseButton>
							</Header>
							<div style={{ flexGrow: 1, overflowY: 'auto' }}>
								{products.availableFilters.brands.map(brand => {
									const selected = selectedBrands.includes(brand);

									return (
										<FilterEntry
											key={brand}
											onClick={() => {
												if (selected) {
													onBrandDeselect(brand);
												} else {
													onBrandSelect(brand);
												}
											}}
											style={{ fontWeight: selected ? 'bold' : 'normal' }}
										>
											{brand}
										</FilterEntry>
									);
								})}
							</div>
							<SaveButton onClick={() => setMobileSearchBrandsOpen(false)}>Spara</SaveButton>
						</div>
					</Drawer>
					<Drawer open={mobileSearchSizesOpen} handler={null} width="100%" placement="left" level={null}>
						<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
							<Header>
								Välj storlekar
								<CloseButton onClick={() => setMobileSearchSizesOpen(false)}>
									<IconWrapper size="1em">
										<FaTimes size="1em" />
									</IconWrapper>
								</CloseButton>
							</Header>
							<div style={{ flexGrow: 1, overflowY: 'auto' }}>
								{products.availableFilters.sizes.map(size => {
									const selected = selectedSizes.includes(size);

									return (
										<FilterEntry
											key={size}
											onClick={() => {
												if (selected) {
													onSizeDeselect(size);
												} else {
													onSizeSelect(size);
												}
											}}
											style={{ fontWeight: selected ? 'bold' : 'normal' }}
										>
											{size}
										</FilterEntry>
									);
								})}
							</div>
							<SaveButton onClick={() => setMobileSearchSizesOpen(false)}>Spara</SaveButton>
						</div>
					</Drawer>
					<Drawer open={mobileSearchColorsOpen} handler={null} width="100%" placement="left" level={null}>
						<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
							<Header>
								Välj färger
								<CloseButton onClick={() => setMobileSearchColorsOpen(false)}>
									<IconWrapper size="1em">
										<FaTimes size="1em" />
									</IconWrapper>
								</CloseButton>
							</Header>
							<div style={{ flexGrow: 1, overflowY: 'auto' }}>
								{products.availableFilters.colors.map(color => {
									const selected = selectedColors.includes(color);

									return (
										<FilterEntry
											key={color}
											onClick={() => {
												if (selected) {
													onColorDeselect(color);
												} else {
													onColorSelect(color);
												}
											}}
											style={{ fontWeight: selected ? 'bold' : 'normal' }}
										>
											{colorCodeToSquare(color)}
											{colorCodeToDisplay(color)}
										</FilterEntry>
									);
								})}
							</div>
							<SaveButton onClick={() => setMobileSearchColorsOpen(false)}>Spara</SaveButton>
						</div>
					</Drawer>
				</div>
			</Drawer>
			<MobileWrapper>
				<button
					style={{
						width: '50%',
						maxWidth: '150px',
						padding: '1em',
						background: 'white',
						borderRadius: '0',
						border: '1px solid black',
						outline: 'none',
						fontWeight: 'bold',
						cursor: 'pointer',
						display: 'block',
						marginRight: '0.25em',
					}}
					onClick={() => setMobileSearchOpen(true)}
				>
					Filter
				</button>
				<div
					style={{ position: 'relative', background: 'white', width: '50%', maxWidth: '150px', marginLeft: '0.25em' }}
				>
					<select
						value={selectedOrderBy}
						onChange={e => onOrderBySelect(e.target.value)}
						style={{
							padding: '1em 2em 1em 1em',
							outline: 'none',
							background: 'none',
							appearance: 'none',
							fontWeight: 'bold',
							border: '1px solid black',
							position: 'relative',
							zIndex: 1,
							width: '100%',
						}}
					>
						<option value="created_DESC">Nyheter</option>
						<option value="price_ASC">Lägsta pris</option>
						<option value="price_DESC">Högsta pris</option>
						<option value="discount_DESC">Högsta rabatt</option>
					</select>
					<div style={{ position: 'absolute', right: '1em', top: '1em', zIndex: 0 }}>
						<IconWrapper size="1em">
							<FaAngleDown size="1em" />
						</IconWrapper>
					</div>
				</div>
			</MobileWrapper>
			<NotMobileWrapper>
				<FiltersContainer>
					<FilterSingleSelect
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
					<FilterMultiSelect
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
					<FilterMultiSelect
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
					<FilterMultiSelect
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
					<FilterRangeSelect
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
			</NotMobileWrapper>
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
