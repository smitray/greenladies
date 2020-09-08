import React from 'react';

import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';

import { Link_link } from './__generated__/Link_link.graphql';

interface LinkViewProps {
	link: Link_link;
}

const LinkView = ({ children, link }: React.PropsWithChildren<LinkViewProps>) => {
	switch (link.__typename) {
		case 'BrandLink':
			return (
				<Link href={`/categories/all?brands=${link.brand.name}`} passHref>
					{children}
				</Link>
			);
		case 'CategoryLink':
			return (
				<Link href="/categories/[key]" as={`/categories/${link.category.urlKey}`} passHref>
					{children}
				</Link>
			);
		case 'SpecialCategoryLink':
			return (
				<Link href="/categories/special/[key]" as={`/categories/special/${link.category.urlKey}`} passHref>
					{children}
				</Link>
			);
		case 'CustomPageLink':
			return (
				<Link href={link.path} passHref>
					{children}
				</Link>
			);
		case 'ProductLink':
			return (
				<Link href="/products/[key]" as={`/products/${link.product.urlKey}`} passHref>
					{children}
				</Link>
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
