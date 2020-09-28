import React from 'react';

import NextLink from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';

import { Link_link } from './__generated__/Link_link.graphql';

interface LinkViewProps {
	link: Link_link;
}

const LinkView = ({ children, link }: React.PropsWithChildren<LinkViewProps>) => {
	switch (link.__typename) {
		case 'BrandLink':
			return (
				<NextLink href={`/categories/all?brands=${link.brand.name}`} passHref>
					{children}
				</NextLink>
			);
		case 'CategoryLink':
			return (
				<NextLink href="/categories/[key]" as={`/categories/${link.category.urlKey}`} passHref>
					{children}
				</NextLink>
			);
		case 'SpecialCategoryLink':
			return (
				<NextLink href="/categories/special/[key]" as={`/categories/special/${link.category.urlKey}`} passHref>
					{children}
				</NextLink>
			);
		case 'CustomPageLink':
			return (
				<NextLink href={link.path} passHref>
					{children}
				</NextLink>
			);
		case 'ProductLink':
			return (
				<NextLink href="/products/[key]" as={`/products/${link.product.urlKey}`} passHref>
					{children}
				</NextLink>
			);
		case '%other':
			return null;
	}
};

export default createFragmentContainer(LinkView, {
	link: graphql`
		fragment Link_link on Link {
			__typename
			... on BrandLink {
				brand {
					id
					name
				}
			}
			... on ProductLink {
				product {
					id
					urlKey
				}
			}
			... on CategoryLink {
				category {
					id
					urlKey
				}
			}
			... on SpecialCategoryLink {
				category {
					id
					urlKey
				}
			}
			... on CustomPageLink {
				path
			}
		}
	`,
});
