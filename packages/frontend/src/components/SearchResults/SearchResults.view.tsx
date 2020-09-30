import React from 'react';

import Link from 'next/link';
import { graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';
import styled from 'styled-components';

import { SearchResultsSearchQuery } from './__generated__/SearchResultsSearchQuery.graphql';

const SEARCH_QUERY = graphql`
	query SearchResultsSearchQuery($query: String!) {
		search(query: $query) {
			brands {
				id
				name
			}
			categories {
				id
				name
				urlKey
			}
			products {
				id
				urlKey
				brand
				name
				image
				originalPrice
				specialPrice
			}
		}
	}
`;

const NoResult = styled.div`
	padding: 48px 0;
	text-align: center;
`;

const SectionsWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 2em;

	@media (min-width: 641px) {
		grid-template-columns: 1fr 1fr;
	}
`;

const Section = styled.div``;

const ProductSection = styled(Section)`
	@media (min-width: 641px) {
		grid-column: 1 / 3;
	}
`;

const SectionHeader = styled.div`
	font-weight: bold;
	margin-bottom: 1em;
`;

const SectionItemsContainer = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

const SectionItemLink = styled.a`
	display: block;
	color: black;
	text-decoration: none;
	padding: 0.25em 0;
`;

const SectionProductsContainer = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;

	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1em;

	@media (min-width: 641px) {
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}

	@media (min-width: 961px) {
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		grid-template-rows: 1fr;
		grid-auto-rows: 0;
	}
	margin: 0 -0.5em;
	overflow: hidden;
`;

const SectionProductWrapper = styled.li`
	font-size: 0.9em;
`;

const SectionProductLink = styled.a`
	display: block;
	color: black;
	text-decoration: none;
`;

const ProductImageStyleWrapper = styled.div`
	background: #f6f6f6;
	margin-bottom: 0.5em;
`;

const ProductImagePositionWrapper = styled.div`
	position: relative;
	padding-top: 131.4%;
`;

const ProductImage = styled.img`
  position: absolute;
  top 0;
  right 5%;
  bottom: 0;
  left: 5%;
  width: 90%;
`;

const ProductName = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-bottom: 0.25em;
`;

const ProductBrand = styled(ProductName)`
	font-weight: bold;
`;

const ProductOriginalPrice = styled.span`
	color: grey;
	text-decoration: line-through;
`;

const ProductSpecialPrice = styled.span`
	color: red;
	margin-left: 0.5em;
`;

interface SearchResultsViewProps {
	query: string;
}

const SearchResultsView = ({ query }: SearchResultsViewProps) => {
	const relayEnvironment = useRelayEnvironment();

	return (
		<QueryRenderer<SearchResultsSearchQuery>
			environment={relayEnvironment}
			query={SEARCH_QUERY}
			variables={{ query }}
			render={({ props, error }) => {
				if (error) {
					return <NoResult>Något gick fel med sökningen</NoResult>;
				}

				if (props) {
					return (
						<SectionsWrapper>
							{props.search.brands.length > 0 && (
								<Section>
									<SectionHeader>Märken</SectionHeader>
									<SectionItemsContainer>
										{props.search.brands.map(brand => (
											<li key={brand.id}>
												<Link href={`/categories/all?brands=${brand.name}`} passHref>
													<SectionItemLink>{brand.name}</SectionItemLink>
												</Link>
											</li>
										))}
									</SectionItemsContainer>
								</Section>
							)}
							{props.search.categories.length > 0 && (
								<Section>
									<SectionHeader>Kategorier</SectionHeader>
									<SectionItemsContainer>
										{props.search.categories.map(category => (
											<li key={category.id}>
												<Link href="/categories/[key]" as={`/categories/${category.urlKey}`} passHref>
													<SectionItemLink>{category.name}</SectionItemLink>
												</Link>
											</li>
										))}
									</SectionItemsContainer>
								</Section>
							)}
							{props.search.products.length > 0 && (
								<ProductSection>
									<SectionHeader>Produkter</SectionHeader>
									<SectionProductsContainer>
										{props.search.products.map(product => (
											<SectionProductWrapper key={product.id}>
												<Link href="/products/[key]" as={`/products/${product.urlKey}`} passHref>
													<SectionProductLink>
														<ProductImageStyleWrapper>
															<ProductImagePositionWrapper>
																<ProductImage src={product.image} />
															</ProductImagePositionWrapper>
														</ProductImageStyleWrapper>
														<ProductBrand>{product.brand}</ProductBrand>
														<ProductName>{product.name}</ProductName>
														<div>
															<ProductOriginalPrice>{product.originalPrice} kr</ProductOriginalPrice>
															<ProductSpecialPrice>{product.specialPrice} kr</ProductSpecialPrice>
														</div>
													</SectionProductLink>
												</Link>
											</SectionProductWrapper>
										))}
									</SectionProductsContainer>
								</ProductSection>
							)}
						</SectionsWrapper>
					);
				}

				return <NoResult>Hämtar sökresultat</NoResult>;
			}}
		/>
	);
};

export default SearchResultsView;
