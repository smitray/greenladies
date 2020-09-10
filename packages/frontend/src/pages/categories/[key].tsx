import React, { useState } from 'react';

import Head from 'next/head';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { CategorySidebar } from '../../components/CategorySidebar';
import { MobileCategoriesList } from '../../components/MobileCategoriesList';
import { ProductsWithFilters } from '../../components/ProductsWithFilters';
import { MyNextPage } from '../../lib/types';
import { CATEGORY_QUERY, CategoryQuery } from '../../queries/category';
import { CenterWrapper } from '../../styles/center-wrapper';
import { initializeSelectedFilters, OrderBy, parseOrderBy } from '../../utils/products-filtering-and-ordering';

const SomeKindOfWrapper = styled.div`
	padding: 24px 0;
	display: flex;
`;

const CategorySidebarWrapper = styled.div`
	width: 200px;
	padding-right: 20px;

	display: none;

	@media (min-width: 961px) {
		display: block;
	}
`;

const MobileCategoriesWrapper = styled.div`
	margin-bottom: 1em;
	@media (min-width: 961px) {
		display: none;
	}
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

const Category: MyNextPage<Props> = ({
	categoryUrlKey,
	initialOrderBy,
	initialBrands,
	initialSizes,
	initialColors,
	initialLowerPrice,
	initialUpperPrice,
}) => {
	const { category } = useLazyLoadQuery<CategoryQuery>(
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

	const [selectedOrderBy, setSelectedOrderBy] = useState(initialOrderBy);
	const [selectedBrands, setSelectedBrands] = useState(initialBrands);
	const [selectedSizes, setSelectedSizes] = useState(initialSizes);
	const [selectedColors, setSelectedColors] = useState(initialColors);
	const [selectedLowerPrice, setSelectedLowerPrice] = useState(initialLowerPrice);
	const [selectedUpperPrice, setSelectedUpperPrice] = useState(initialUpperPrice);

	const [selectedFilters, setSelectedFilters] = useState<{ filter: string; code: string; display: string }[]>(
		initializeSelectedFilters(initialBrands, initialSizes, initialColors, initialLowerPrice, initialUpperPrice),
	);

	return (
		<React.Fragment>
			<Head>
				<title>{category.metaTitle}</title>
				<meta name="keywords" content={category.metaKeywords} />
				<meta name="description" content={category.metaDescription} />
				<meta name="robots" content="index,follow" />
			</Head>
			<CenterWrapper>
				<SomeKindOfWrapper>
					<CategorySidebarWrapper>
						<CategorySidebar category={category} />
					</CategorySidebarWrapper>
					<div style={{ flexGrow: 1 }}>
						<h1 style={{ margin: '0 0 16px 0' }}>
							{category.name}
							{initialBrands.length === 1 && (
								<span style={{ marginLeft: '16px', fontSize: '16px', fontWeight: 'normal' }}>
									från {initialBrands[0]}
								</span>
							)}
						</h1>
						<MobileCategoriesWrapper>
							<MobileCategoriesList category={category} />
						</MobileCategoriesWrapper>
						<ProductsWithFilters
							products={category.products}
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
		</React.Fragment>
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
