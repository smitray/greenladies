import React, { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { ProductsWithFilters } from '../../../components/ProductsWithFilters';
import { MyNextPage } from '../../../lib/types';
import { SPECIAL_CATEGORY_QUERY, SpecialCategoryQuery } from '../../../queries/special-category';
import { filterObjectByKeys } from '../../../utils/object';
import { initializeSelectedFilters, OrderBy, parseOrderBy } from '../../../utils/products-filtering-and-ordering';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	display: flex;
`;

const CategorySidebarLink = styled.a`
	font-size: 14px;
	display: inline-block;
	position: relative;
	color: black;
	text-decoration: none;

	&:hover {
		border-bottom: 1px solid black;
	}
`;

const CategorySidebarNoLink = styled.div`
	font-size: 14px;
	padding: 5px 0;
	color: grey;
`;

const CategorySidebarList = styled.ul`
	padding: 0 0 0 15px;
	margin: 0;
	list-style: none;
`;

const CategoryProductCount = styled.span`
	font-size: 12px;
	color: grey;
	margin-left: 4px;
`;

interface Props {
	categoryUrlKey: string;
	initialOrderBy: OrderBy;
	initialBrands: string[];
	initialSizes: string[];
	initialColors: string[];
	initialLowerPrice: number | null;
	initialUpperPrice: number | null;
}

const SpecialCategory: MyNextPage<Props> = ({
	categoryUrlKey,
	initialOrderBy,
	initialBrands,
	initialSizes,
	initialColors,
	initialLowerPrice,
	initialUpperPrice,
}) => {
	const { specialCategory, rootCategories } = useLazyLoadQuery<SpecialCategoryQuery>(
		SPECIAL_CATEGORY_QUERY,
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

	const [selectedOrderBy, setSelectedOrderBy] = useState(initialOrderBy);
	const [selectedBrands, setSelectedBrands] = useState(initialBrands);
	const [selectedSizes, setSelectedSizes] = useState(initialSizes);
	const [selectedColors, setSelectedColors] = useState(initialColors);
	const [selectedLowerPrice, setSelectedLowerPrice] = useState(initialLowerPrice);
	const [selectedUpperPrice, setSelectedUpperPrice] = useState(initialUpperPrice);

	const [selectedFilters, setSelectedFilters] = useState<{ filter: string; code: string; display: string }[]>(
		initializeSelectedFilters(initialBrands, initialSizes, initialColors, initialLowerPrice, initialUpperPrice),
	);

	const { query } = useRouter();

	const processedQuery = useMemo(() => {
		return filterObjectByKeys(['orderBy', 'brands', 'sizes', 'colors', 'price'], query);
	}, [query]);

	return (
		<CenterWrapper>
			<div style={{ width: '200px', paddingRight: '20px' }}>
				<CategorySidebarList>
					{rootCategories.map(category => (
						<li key={category.id} style={{ padding: '4px 0' }}>
							{category.categoryProducts.totalCount > 0 ? (
								<React.Fragment>
									<Link
										href={{ pathname: '/categories/[key]', query: processedQuery }}
										as={{ pathname: `/categories/${category.urlKey}`, query: processedQuery }}
										passHref
									>
										<CategorySidebarLink>{category.name}</CategorySidebarLink>
									</Link>
									<CategoryProductCount>({category.categoryProducts.totalCount})</CategoryProductCount>
								</React.Fragment>
							) : (
								<CategorySidebarNoLink>
									{category.name}
									<CategoryProductCount>(0)</CategoryProductCount>
								</CategorySidebarNoLink>
							)}
						</li>
					))}
				</CategorySidebarList>
			</div>
			<div style={{ flexGrow: 1 }}>
				<h1 style={{ margin: '0 0 16px 0' }}>
					Hela sortimentet
					{initialBrands.length === 1 && (
						<span style={{ marginLeft: '16px', fontSize: '16px', fontWeight: 'normal' }}>från {initialBrands[0]}</span>
					)}
				</h1>
				<ProductsWithFilters
					products={specialCategory.products}
					selectedOrderBy={selectedOrderBy}
					selectedBrands={selectedBrands}
					selectedSizes={selectedSizes}
					selectedColors={selectedColors}
					selectedLowerPrice={selectedLowerPrice}
					selectedUpperPrice={selectedUpperPrice}
					setSelectedOrderBy={setSelectedOrderBy}
					setSelectedBrands={setSelectedBrands}
					setSelectedSizes={setSelectedSizes}
					setSelectedColors={setSelectedColors}
					setSelectedLowerPrice={setSelectedLowerPrice}
					setSelectedUpperPrice={setSelectedUpperPrice}
					selectedFilters={selectedFilters}
					setSelectedFilters={setSelectedFilters}
				/>
			</div>
		</CenterWrapper>
	);
};

SpecialCategory.getInitialProps = async ({ relayEnvironment, query }) => {
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

	await fetchQuery<SpecialCategoryQuery>(relayEnvironment, SPECIAL_CATEGORY_QUERY, {
		where: { urlKey: categoryUrlKey },
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

export default SpecialCategory;