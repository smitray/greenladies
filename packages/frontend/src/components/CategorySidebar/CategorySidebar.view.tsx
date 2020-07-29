import React from 'react';

import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { CategorySidebar_category } from './__generated__/CategorySidebar_category.graphql';

interface Category {
	name: string;
	key: string;
	children: Category[];
}

interface InputCategory {
	name: string;
	key: string;
	parent?: InputCategory | null;
	children?: ReadonlyArray<InputCategory>;
}

function inputToOutputCategory(category: InputCategory): Category {
	return {
		name: category.name,
		key: category.key,
		children: (category.children || []).map(child => {
			return inputToOutputCategory(child);
		}),
	};
}

function createCategoryTree(category: CategorySidebar_category): Category {
	let root: InputCategory = category;
	while (root.parent) {
		root = {
			name: root.parent.name,
			key: root.parent.key,
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

const CategorySidebarList = styled.ul`
	padding: 0 0 0 15px;
	margin: 0;
	list-style: none;
`;

interface CategorySidebarRecursiveProps {
	category: Category;
	currentCategoryKey: string;
}

const CategorySidebarRecursive: React.FC<CategorySidebarRecursiveProps> = ({ category, currentCategoryKey }) => {
	return (
		<React.Fragment>
			<Link href="/categories/[key]" as={`/categories/${category.key}`}>
				<CategorySidebarLink href={`/categories/${category.key}`} selected={category.key === currentCategoryKey}>
					{category.name}
				</CategorySidebarLink>
			</Link>
			{category.children.length > 0 && (
				<CategorySidebarList>
					{category.children.map(childCategory => (
						<li key={childCategory.key}>
							<CategorySidebarRecursive category={childCategory} currentCategoryKey={currentCategoryKey} />
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

	return <CategorySidebarRecursive category={categoryTree} currentCategoryKey={category.key} />;
};

export default createFragmentContainer(CategorySidebarView, {
	category: graphql`
		fragment CategorySidebar_category on Category {
			name
			key
			children {
				name
				key
			}
			parent {
				name
				key
				children {
					name
					key
				}
				parent {
					name
					key
					children {
						name
						key
					}
					parent {
						name
						key
						children {
							name
							key
						}
					}
				}
			}
		}
	`,
});
