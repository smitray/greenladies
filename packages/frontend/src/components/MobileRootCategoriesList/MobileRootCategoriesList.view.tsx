import React, { useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { filterObjectByKeys } from '../../utils/object';

import { MobileRootCategoriesList_query } from './__generated__/MobileRootCategoriesList_query.graphql';

const CategoriesContainer = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-wrap: wrap;
	width: 100%;

	> li:nth-child(even) {
		border-left: none;
	}
`;

const CategoryItem = styled.li`
	flex-basis: 50%;
	width: 50%;
	border: 1px solid #ddd;
`;

const CategoryLink = styled.a`
	display: block;
	color: black;
	text-decoration: none;
	cursor: pointer;
	padding: 12px 18px;
	flex-shrink: 0;
	text-align: center;
`;

interface MobileRootCategoriesListViewProps {
	query: MobileRootCategoriesList_query;
}

const MobileRootCategoriesListView = ({ query: relayQuery }: MobileRootCategoriesListViewProps) => {
	const { query } = useRouter();

	const processedQuery = useMemo(() => {
		return filterObjectByKeys(['orderBy', 'brands', 'sizes', 'colors', 'price'], query);
	}, [query]);

	const categories = useMemo(() => relayQuery.rootCategories.filter(c => c.categoryProducts.totalCount > 0), [
		relayQuery.rootCategories,
	]);

	return (
		<CategoriesContainer>
			{categories.map(category => (
				<CategoryItem key={category.id}>
					<Link
						href={{ pathname: '/categories/[key]', query: processedQuery }}
						as={{ pathname: `/categories/${category.urlKey}`, query: processedQuery }}
						passHref
					>
						<CategoryLink>{category.name}</CategoryLink>
					</Link>
				</CategoryItem>
			))}
		</CategoriesContainer>
	);
};

export default createFragmentContainer(MobileRootCategoriesListView, {
	query: graphql`
		fragment MobileRootCategoriesList_query on Query @argumentDefinitions(filters: { type: "ProductFiltersInput" }) {
			rootCategories {
				id
				name
				urlKey
				categoryProducts: products(filters: $filters) {
					totalCount
				}
			}
		}
	`,
});
