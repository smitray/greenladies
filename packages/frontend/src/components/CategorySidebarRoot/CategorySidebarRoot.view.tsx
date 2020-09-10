import React, { useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { filterObjectByKeys } from '../../utils/object';

import { CategorySidebarRoot_query } from './__generated__/CategorySidebarRoot_query.graphql';

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
	padding: 0;
	margin: 0;
	list-style: none;
`;

const CategoryProductCount = styled.span`
	font-size: 12px;
	color: grey;
	margin-left: 4px;
`;

interface CategorySideRootViewProps {
	query: CategorySidebarRoot_query;
}

const CategorySidebarRootView = ({ query: relayQuery }: CategorySideRootViewProps) => {
	const { query } = useRouter();

	const processedQuery = useMemo(() => {
		return filterObjectByKeys(['orderBy', 'brands', 'sizes', 'colors', 'price'], query);
	}, [query]);

	return (
		<CategorySidebarList>
			{relayQuery.rootCategories.map(category => (
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
	);
};

export default createFragmentContainer(CategorySidebarRootView, {
	query: graphql`
		fragment CategorySidebarRoot_query on Query @argumentDefinitions(filters: { type: "ProductFiltersInput" }) {
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
