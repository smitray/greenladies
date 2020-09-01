import React, { useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { filterObjectByKeys } from '../../utils/object';

import { CategorySidebar_category } from './__generated__/CategorySidebar_category.graphql';

interface Category {
	id: string;
	name: string;
	urlKey: string;
	productCount: number;
	children: Category[];
}

interface InputCategory {
	id: string;
	name: string;
	urlKey: string;
	categoryProducts: {
		totalCount: number;
	};
	parent?: InputCategory | null;
	children?: ReadonlyArray<InputCategory>;
}

function inputToOutputCategory(category: InputCategory): Category {
	return {
		id: category.id,
		name: category.name,
		urlKey: category.urlKey,
		productCount: category.categoryProducts.totalCount,
		children: (category.children || []).map(child => {
			return inputToOutputCategory(child);
		}),
	};
}

function createCategoryTree(category: CategorySidebar_category): Category {
	let root: InputCategory = category;
	while (root.parent) {
		root = {
			id: root.parent.id,
			name: root.parent.name,
			urlKey: root.parent.urlKey,
			categoryProducts: root.parent.categoryProducts,
			children: root.parent.children?.map(child => (child.name === root.name ? root : child)),
			parent: root.parent.parent,
		};
	}

	return inputToOutputCategory(root);
}

interface CategorySidebarLinkProps {
	selected: boolean;
}

const CategorySidebarLink = styled.a<CategorySidebarLinkProps>`
	font-size: 14px;
	display: inline-block;
	position: relative;
	padding-bottom: ${({ selected }) => (selected ? '4px' : '0')};
	font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
	color: black;
	border-bottom: ${({ selected }) => (selected ? '1px solid black' : '1px solid transparent')};
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

interface CategorySidebarRecursiveProps {
	category: Category;
	currentCategoryId: string;
	query: Record<string, any>;
}

const CategorySidebarRecursive: React.FC<CategorySidebarRecursiveProps> = ({ category, currentCategoryId, query }) => {
	return (
		<React.Fragment>
			{category.productCount > 0 ? (
				<React.Fragment>
					<Link
						href={{ pathname: '/categories/[key]', query }}
						as={{ pathname: `/categories/${category.urlKey}`, query }}
						passHref
					>
						<CategorySidebarLink selected={category.id === currentCategoryId}>{category.name}</CategorySidebarLink>
					</Link>
					<CategoryProductCount>({category.productCount})</CategoryProductCount>
				</React.Fragment>
			) : (
				<CategorySidebarNoLink>
					{category.name}
					<CategoryProductCount>(0)</CategoryProductCount>
				</CategorySidebarNoLink>
			)}
			{category.children.length > 0 && (
				<CategorySidebarList>
					{category.children.map(childCategory => (
						<li key={childCategory.id} style={{ padding: '4px 0' }}>
							<CategorySidebarRecursive category={childCategory} currentCategoryId={currentCategoryId} query={query} />
						</li>
					))}
				</CategorySidebarList>
			)}
		</React.Fragment>
	);
};

interface Props {
	category: CategorySidebar_category;
}

const CategorySidebarView: React.FC<Props> = ({ category }) => {
	const categoryTree = createCategoryTree(category);

	const { query } = useRouter();

	const processedQuery = useMemo(() => {
		return filterObjectByKeys(['orderBy', 'brands', 'sizes', 'colors', 'price'], query);
	}, [query]);

	return (
		<div>
			<div style={{ marginBottom: '8px' }}>
				<Link
					href={{ pathname: '/categories/[key]', query: processedQuery }}
					as={{ pathname: `/categories/${categoryTree.urlKey}`, query: processedQuery }}
				>
					<a style={{ color: 'black', textDecoration: 'none' }}>
						<strong style={{ fontSize: '16px' }}>{categoryTree.name}</strong>
					</a>
				</Link>
				<CategoryProductCount>({categoryTree.productCount})</CategoryProductCount>
			</div>
			<ul style={{ margin: '0', padding: '0', listStyle: 'none' }}>
				{categoryTree.children.map(child => (
					<li key={child.id} style={{ padding: '4px 0' }}>
						<CategorySidebarRecursive category={child} currentCategoryId={category.id} query={processedQuery} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default createFragmentContainer(CategorySidebarView, {
	category: graphql`
		fragment CategorySidebar_category on Category @argumentDefinitions(filters: { type: "ProductFiltersInput" }) {
			id
			name
			urlKey
			categoryProducts: products(filters: $filters) {
				totalCount
			}
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
				categoryProducts: products(filters: $filters) {
					totalCount
				}
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
					categoryProducts: products(filters: $filters) {
						totalCount
					}
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
						categoryProducts: products(filters: $filters) {
							totalCount
						}
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
			}
		}
	`,
});
