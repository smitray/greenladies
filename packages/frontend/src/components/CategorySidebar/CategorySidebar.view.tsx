import React from 'react';

import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { CategorySidebar_category } from './__generated__/CategorySidebar_category.graphql';

interface Category {
	id: string;
	name: string;
	urlKey: string;
	hasProducts: boolean;
	children: Category[];
}

interface InputCategory {
	id: string;
	name: string;
	urlKey: string;
	products: {
		totalCount: number;
	} | null;
	parent?: InputCategory | null;
	children?: ReadonlyArray<InputCategory>;
}

function inputToOutputCategory(category: InputCategory): Category {
	return {
		id: category.id,
		name: category.name,
		urlKey: category.urlKey,
		hasProducts: (category.products?.totalCount || 0) > 0,
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
			products: root.parent.products,
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
	display: block;
	padding: 5px 0;
	font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
	text-decoration: ${({ selected }) => (selected ? 'underline' : 'none')};
	color: black;

	&:hover {
		text-decoration: underline;
	}
`;

const CategorySidebarNoLink = styled.div`
	padding: 5px 0;
	color: grey;
`;

const CategorySidebarList = styled.ul`
	padding: 0 0 0 15px;
	margin: 0;
	list-style: none;
`;

interface CategorySidebarRecursiveProps {
	category: Category;
	currentCategoryId: string;
}

const CategorySidebarRecursive: React.FC<CategorySidebarRecursiveProps> = ({ category, currentCategoryId }) => {
	return (
		<React.Fragment>
			{(category.hasProducts && (
				<Link href="/categories/[key]" as={`/categories/${category.urlKey}`}>
					<CategorySidebarLink href={`/categories/${category.urlKey}`} selected={category.id === currentCategoryId}>
						{category.name}
					</CategorySidebarLink>
				</Link>
			)) || <CategorySidebarNoLink>{category.name}</CategorySidebarNoLink>}
			{category.children.length > 0 && (
				<CategorySidebarList>
					{category.children.map(childCategory => (
						<li key={childCategory.id}>
							<CategorySidebarRecursive category={childCategory} currentCategoryId={currentCategoryId} />
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

	return <CategorySidebarRecursive category={categoryTree} currentCategoryId={category.id} />;
};

export default createFragmentContainer(CategorySidebarView, {
	category: graphql`
		fragment CategorySidebar_category on Category {
			id
			name
			urlKey
			products {
				totalCount
			}
			children {
				id
				name
				urlKey
				products {
					totalCount
				}
			}
			parent {
				id
				name
				urlKey
				products {
					totalCount
				}
				children {
					id
					name
					urlKey
					products {
						totalCount
					}
				}
				parent {
					id
					name
					urlKey
					products {
						totalCount
					}
					children {
						id
						name
						urlKey
						products {
							totalCount
						}
					}
					parent {
						id
						name
						urlKey
						products {
							totalCount
						}
						children {
							id
							name
							urlKey
							products {
								totalCount
							}
						}
					}
				}
			}
		}
	`,
});
