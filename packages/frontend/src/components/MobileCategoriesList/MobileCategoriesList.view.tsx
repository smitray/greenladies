import React, { useMemo } from 'react';

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
	flex-wrap: wrap;
	width: 100%;
`;

const CategoryItem = styled.li`
	flex-basis: 50%;
	width: 50%;
	border-right: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
	border-left: 1px solid #ddd;

	&:nth-child(1),
	&:nth-child(2) {
		border-top: 1px solid #ddd;
	}

	&:nth-child(even) {
		border-left: none;
	}
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

interface MobileCategoriesListViewProps {
	category: MobileCategoriesList_category;
}

const MobileCategoriesListView = ({ category }: MobileCategoriesListViewProps) => {
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
