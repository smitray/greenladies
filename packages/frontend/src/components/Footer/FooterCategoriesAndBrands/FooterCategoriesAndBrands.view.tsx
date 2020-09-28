import React from 'react';

import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';

import { FooterCategoriesAndBrands_query } from './__generated__/FooterCategoriesAndBrands_query.graphql';
import {
	CategoriesAndBrandsHeader,
	CategoriesAndBrandsLink,
	CategoriesAndBrandsSection,
	CategoriesAndBrandsSeparator,
	CategoriesAndBrandsWrapper,
} from './FooterCategoriesAndBrands.styles';

interface FooterCategoriesAndBrandsViewProps {
	query: FooterCategoriesAndBrands_query;
}

const FooterCategoriesAndBrandsView = ({ query }: FooterCategoriesAndBrandsViewProps) => {
	const sortedCategories = query.categories.slice().sort((left, right) => left.name.localeCompare(right.name));
	const sortedBrands = query.brands.slice().sort((left, right) => left.name.localeCompare(right.name));

	return (
		<CategoriesAndBrandsWrapper>
			<CategoriesAndBrandsHeader>KATEGORIER | MÄRKEN & DESIGNERS</CategoriesAndBrandsHeader>
			<CategoriesAndBrandsSection>
				{sortedCategories.map((category, index) => (
					<React.Fragment key={category.id}>
						{index !== 0 && <CategoriesAndBrandsSeparator>.</CategoriesAndBrandsSeparator>}
						<Link href="/categories/[key]" as={`/categories/${category.urlKey}`} passHref>
							<CategoriesAndBrandsLink>{category.name}</CategoriesAndBrandsLink>
						</Link>
					</React.Fragment>
				))}
			</CategoriesAndBrandsSection>
			<CategoriesAndBrandsSection>
				{sortedBrands.map((brand, index) => (
					<React.Fragment key={index}>
						{index !== 0 && <CategoriesAndBrandsSeparator>.</CategoriesAndBrandsSeparator>}
						<Link href={`/categories/all?brands=${brand.name}`} as={`/categories/all?brands=${brand.name}`} passHref>
							<CategoriesAndBrandsLink>{brand.name}</CategoriesAndBrandsLink>
						</Link>
					</React.Fragment>
				))}
			</CategoriesAndBrandsSection>
		</CategoriesAndBrandsWrapper>
	);
};

export default createFragmentContainer(FooterCategoriesAndBrandsView, {
	query: graphql`
		fragment FooterCategoriesAndBrands_query on Query {
			brands {
				name
			}
			categories {
				id
				name
				urlKey
			}
		}
	`,
});
