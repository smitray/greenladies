import React, { useState } from 'react';

import { useRouter } from 'next/router';
import { stringify } from 'query-string';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { CategorySidebar } from '../../components/CategorySidebar';
import { ProductFilters } from '../../components/ProductFilters';
import { ProductList } from '../../components/ProductList';
import { ProductSelectedFilters } from '../../components/ProductSelectedFilters';
import { useDidUpdateEffect } from '../../hooks/use-did-update-effect';
import { MyNextPage } from '../../lib/types';
import { CATEGORY_QUERY, CategoryQuery } from '../../queries/category';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	display: flex;
`;

const parseOrderBy = (orderBy: any) => {
	if (orderBy === 'popularity_DESC') {
		return 'popularity_DESC';
	}

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

	return 'popularity_DESC';
};

type OrderBy = 'popularity_DESC' | 'created_DESC' | 'price_ASC' | 'price_DESC' | 'discount_DESC';

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

const initializeSelectedFilters = (
	brands: string[],
	sizes: string[],
	colors: string[],
	lowerPrice: number | null,
	upperPrice: number | null,
) => {
	return [
		...brands.map(brand => ({
			filter: 'brand',
			code: brand,
			display: brand,
		})),
		...sizes.map(size => ({
			filter: 'size',
			code: size,
			display: size,
		})),
		...colors.map(color => ({
			filter: 'color',
			code: color,
			display: colorCodeToDisplay(color),
		})),
		...(lowerPrice !== null || upperPrice !== null
			? [
					{
						filter: 'price',
						code: 'price',
						display: `${lowerPrice !== null ? `${lowerPrice} kr ` : ''}-${
							upperPrice !== null ? ` ${upperPrice} kr` : ''
						}`,
					},
			  ]
			: []),
	];
};

interface Props {
	categoryUrlKey: string;
	initialOrderBy: OrderBy;
	initialBrands: string[];
	initialSizes: string[];
	initialColors: string[];
	initialLowerPrice: number | null;
	initialUpperPrice: number | null;
}

const Category: MyNextPage<Props> = ({
	categoryUrlKey,
	initialOrderBy,
	initialBrands,
	initialSizes,
	initialColors,
	initialLowerPrice,
	initialUpperPrice,
}) => {
	const { category: initialCategory } = useLazyLoadQuery<CategoryQuery>(
		CATEGORY_QUERY,
		{
			where: { urlKey: categoryUrlKey },
			orderBy: initialOrderBy,
			filters: {
				brand_in: initialBrands,
				color_in: initialColors,
				size_in: initialSizes,
				price_between: {
					from: initialLowerPrice,
					to: initialUpperPrice,
				},
			},
		},
		{ fetchPolicy: 'store-only' },
	);

	const router = useRouter();

	const [category, setCategory] = useState(initialCategory);

	const [selectedOrderBy, setSelectedOrderBy] = useState(initialOrderBy);
	const [selectedBrands, setSelectedBrands] = useState(initialBrands);
	const [selectedSizes, setSelectedSizes] = useState(initialSizes);
	const [selectedColors, setSelectedColors] = useState(initialColors);
	const [selectedLowerPrice, setSelectedLowerPrice] = useState(initialLowerPrice);
	const [selectedUpperPrice, setSelectedUpperPrice] = useState(initialUpperPrice);

	const [selectedFilters, setSelectedFilters] = useState<{ filter: string; code: string; display: string }[]>(
		initializeSelectedFilters(initialBrands, initialSizes, initialColors, initialLowerPrice, initialUpperPrice),
	);

	useDidUpdateEffect(() => {
		setCategory(initialCategory);
	}, [initialCategory]);

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

		router.replace(`${router.pathname}?${stringify(query)}`, `/categories/${category.urlKey}?${stringify(query)}`);
	}, [selectedOrderBy, selectedBrands, selectedSizes, selectedColors, selectedUpperPrice, selectedLowerPrice]);

	return (
		<CenterWrapper>
			<div style={{ width: '200px', paddingRight: '20px' }}>
				<CategorySidebar category={category} />
			</div>
			<div style={{ flexGrow: 1 }}>
				<h1 style={{ margin: '0 0 16px 0' }}>{category.name}</h1>
				<ProductFilters
					products={category.products}
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
				<ProductList products={category.products} />
			</div>
		</CenterWrapper>
	);
};

Category.getInitialProps = async ({ relayEnvironment, query }) => {
	const { key, orderBy, brands, sizes, colors, price } = query;

	const categoryUrlKey = typeof key === 'string' ? key : '';

	const parsedOrderBy = parseOrderBy(orderBy);
	const parsedBrands = typeof brands === 'string' ? brands.split(',').map(brand => brand.trim()) : [];
	const parsedSizes = typeof sizes === 'string' ? sizes.split(',').map(size => size.trim()) : [];
	const parsedColors = typeof colors === 'string' ? colors.split(',').map(color => color.trim()) : [];

	let parsedLowerPrice: number | null = null;
	let parsedUpperPrice: number | null = null;
	if (typeof price === 'string') {
		const [lower, upper] = price.split('-');
		const lowerInt = parseInt(lower, 10);
		if (!isNaN(lowerInt) && lowerInt >= 0) {
			parsedLowerPrice = lowerInt;
		}

		const upperInt = parseInt(upper, 10);
		if (!isNaN(upperInt)) {
			parsedUpperPrice = upperInt;
		}
	}

	await fetchQuery<CategoryQuery>(relayEnvironment, CATEGORY_QUERY, {
		where: {
			urlKey: categoryUrlKey,
		},
		orderBy: parsedOrderBy,
		filters: {
			brand_in: parsedBrands,
			color_in: parsedColors,
			size_in: parsedSizes,
			price_between: {
				from: parsedLowerPrice,
				to: parsedUpperPrice,
			},
		},
	});

	return {
		categoryUrlKey,
		initialOrderBy: parsedOrderBy,
		initialBrands: parsedBrands,
		initialSizes: parsedSizes,
		initialColors: parsedColors,
		initialLowerPrice: parsedLowerPrice,
		initialUpperPrice: parsedUpperPrice,
	};
};

export default Category;
