import React from 'react';

import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';

import { FooterCategoriesAndBrands_query } from './__generated__/FooterCategoriesAndBrands_query.graphql';

interface FooterCategoriesAndBrandsViewProps {
	query: FooterCategoriesAndBrands_query;
}

const FooterCategoriesAndBrandsView = ({ query }: FooterCategoriesAndBrandsViewProps) => {
	return (
		<div style={{ padding: '24px', textAlign: 'center' }}>
			<h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0' }}>KATEGORIER | MÄRKEN & DESIGNERS</h1>
			<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
				{query.categories.map((category, index) => (
					<React.Fragment key={category.id}>
						{index !== 0 && <div style={{ lineHeight: '12px', color: 'grey' }}>.</div>}
						<Link href="/categories/[key]" as={`/categories/${category.urlKey}`} passHref>
							<a style={{ padding: '2px 8px', fontSize: '14px', textDecoration: 'none', color: 'black' }}>
								{category.name}
							</a>
						</Link>
					</React.Fragment>
				))}
			</div>
			<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
				{query.brands.map((brand, index) => (
					<React.Fragment key={index}>
						{index !== 0 && <div style={{ lineHeight: '12px', color: 'grey' }}>.</div>}
						<div style={{ padding: '2px 8px', fontSize: '14px' }}>{brand}</div>
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default createFragmentContainer(FooterCategoriesAndBrandsView, {
	query: graphql`
		fragment FooterCategoriesAndBrands_query on Query {
			brands
			categories {
				id
				name
				urlKey
			}
		}
	`,
});
