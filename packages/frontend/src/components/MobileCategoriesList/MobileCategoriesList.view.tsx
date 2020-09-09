import React, { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { filterObjectByKeys } from '../../utils/object';

import { MobileCategoriesList_category } from './__generated__/MobileCategoriesList_category.graphql';

const CategoriesContainer = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
`;

const CategoryLink = styled.a`
	display: block;
	color: black;
	text-decoration: none;
	border: 1px solid black;
	padding: 0.5em 1em;
	cursor: pointer;
	margin-right: 0.5em;
`;

const ShowMoreButton = styled.button`
	display: block;
	color: black;
	text-decoration: none;
	border: 1px solid black;
	padding: 0.5em 1em;
	cursor: pointer;
	margin-right: 0.5em;
	outline: none;
	background: white;
	font-size: 1em;
`;

interface MobileCategoriesListViewProps {
	category: MobileCategoriesList_category;
}

const MobileCategoriesListView = ({ category }: MobileCategoriesListViewProps) => {
	const [viewAll, setViewAll] = useState(false);

	const { query } = useRouter();

	const processedQuery = useMemo(() => {
		return filterObjectByKeys(['orderBy', 'brands', 'sizes', 'colors', 'price'], query);
	}, [query]);

	const categories = useMemo(
		() => [
			...category.children.filter(c => c.categoryProducts.totalCount > 0),
			...(category.parent?.children.filter(c => c.id !== category.id && c.categoryProducts.totalCount > 0) || []),
		],
		[category],
	);

	return (
		<CategoriesContainer>
			{(viewAll ? categories : categories.slice(0, 4)).map(category => (
				<li key={category.id}>
					<Link
						href={{ pathname: '/categories/[key]', query: processedQuery }}
						as={{ pathname: `/categories/${category.urlKey}`, query: processedQuery }}
						passHref
					>
						<CategoryLink>{category.name}</CategoryLink>
					</Link>
				</li>
			))}
			{!viewAll && categories.length > 4 && (
				<li>
					<ShowMoreButton onClick={() => setViewAll(true)}>Visa alla</ShowMoreButton>
				</li>
			)}
		</CategoriesContainer>
	);
};

export default createFragmentContainer(MobileCategoriesListView, {
	category: graphql`
		fragment MobileCategoriesList_category on Category @argumentDefinitions(filters: { type: "ProductFiltersInput" }) {
			id
			name
			urlKey
			children {
				id
				name
				urlKey
				categoryProducts: products(filters: $filters) {
					totalCount
				}
			}
			parent {
				id
				name
				urlKey
				children {
					id
					name
					urlKey
					categoryProducts: products(filters: $filters) {
						totalCount
					}
				}
			}
		}
	`,
});
