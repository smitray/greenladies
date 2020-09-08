import React, { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { ProductsWithFilters } from '../../components/ProductsWithFilters';
import { MyNextPage } from '../../lib/types';
import { ALL_CATEGORIES_QUERY, AllCategoriesQuery } from '../../queries/all-categories';
import { CenterWrapper } from '../../styles/center-wrapper';
import { filterObjectByKeys } from '../../utils/object';
import { initializeSelectedFilters, OrderBy, parseOrderBy } from '../../utils/products-filtering-and-ordering';

const SomeKindOfWrapper = styled.div`
	padding: 24px 0;
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

const CategorySidebarWrapper = styled.div`
	width: 200px;
	padding-right: 20px;

	display: none;

	@media (min-width: 961px) {
		display: block;
	}
`;

interface Props {
	initialOrderBy: OrderBy;
	initialBrands: string[];
	initialSizes: string[];
	initialColors: string[];
	initialLowerPrice: number | null;
	initialUpperPrice: number | null;
}

const AllCategories: MyNextPage<Props> = ({
	initialOrderBy,
	initialBrands,
	initialSizes,
	initialColors,
	initialLowerPrice,
	initialUpperPrice,
}) => {
	const { products, rootCategories } = useLazyLoadQuery<AllCategoriesQuery>(
		ALL_CATEGORIES_QUERY,
		{
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
			<SomeKindOfWrapper>
				<CategorySidebarWrapper>
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
				</CategorySidebarWrapper>
				<div style={{ flexGrow: 1 }}>
					<h1 style={{ margin: '0 0 16px 0' }}>
						Hela sortimentet
						{initialBrands.length === 1 && (
							<span style={{ marginLeft: '16px', fontSize: '16px', fontWeight: 'normal' }}>
								från {initialBrands[0]}
							</span>
						)}
					</h1>
					<ProductsWithFilters
						products={products}
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
			</SomeKindOfWrapper>
		</CenterWrapper>
	);
};

AllCategories.getInitialProps = async ({ relayEnvironment, query }) => {
	const { orderBy, brands, sizes, colors, price } = query;

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

	await fetchQuery<AllCategoriesQuery>(relayEnvironment, ALL_CATEGORIES_QUERY, {
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
		initialOrderBy: parsedOrderBy,
		initialBrands: parsedBrands,
		initialSizes: parsedSizes,
		initialColors: parsedColors,
		initialLowerPrice: parsedLowerPrice,
		initialUpperPrice: parsedUpperPrice,
	};
};

export default AllCategories;
