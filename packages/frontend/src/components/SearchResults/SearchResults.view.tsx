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
	grid-column: 1 / 3;
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
	display: flex;
	margin: 0 -0.5em;
	overflow: hidden;
`;

const SectionProductWrapper = styled.li`
	flex-basis: 50%;
	width: 50%;
	flex-grow: 0;
	flex-shrink: 0;
	font-size: 0.9em;

	@media (min-width: 1281px) {
		flex-basis: ${100 / 6}%;
		width: ${100 / 6}%;
	}
`;

const SectionProductLink = styled.a`
	display: block;
	padding: 0 0.5em;
	color: black;
	text-decoration: none;
`;

const ProductImageStyleWrapper = styled.div`
	padding: 0 5%;
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

/* {searchResults === null ||
			(searchResults.brands.length === 0 &&
				searchResults.categories.length === 0 &&
				searchResults.products.length === 0) ? (
				<div style={{ padding: '64px', textAlign: 'center' }}>inga resultat hittades</div>
			) : (
				<React.Fragment>
					{(searchResults.brands.length > 0 || searchResults.categories.length > 0) && (
						<div style={{ display: 'flex', marginBottom: '24px' }}>
							{searchResults.brands.length > 0 && (
								<div
									style={{
										flexBasis: '50%',
										flexShrink: 0,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-start',
									}}
								>
									<div style={{ fontWeight: 'bold', marginBottom: '16px' }}>Märken</div>
									{searchResults.brands.map(brand => (
										<NextLink key={brand.id} href={`/categories/all?brands=${brand.name}`} passHref>
											<a style={{ color: 'black', textDecoration: 'none', padding: '4px 0' }}>{brand.name}</a>
										</NextLink>
									))}
								</div>
							)}
							{searchResults.categories.length > 0 && (
								<div
									style={{
										flexBasis: '50%',
										flexShrink: 0,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-start',
									}}
								>
									<div style={{ fontWeight: 'bold', marginBottom: '16px' }}>Kategorier</div>
									{searchResults.categories.map(category => (
										<NextLink key={category.id} href="/categories/[key]" as={`/categories/${category.urlKey}`} passHref>
											<a style={{ color: 'black', textDecoration: 'none', padding: '4px 0' }}>{category.name}</a>
										</NextLink>
									))}
								</div>
							)}
						</div>
					)}

					{searchResults.products.length > 0 && (
						<React.Fragment>
							<div style={{ fontWeight: 'bold', marginBottom: '16px' }}>Produkter</div>
							<div>
								<div style={{ display: 'flex', margin: '0 -8px' }}>
									{searchResults.products.slice(0, 7).map(product => (
										<NextLink key={product.id} href="/products/[key]" as={`/products/${product.urlKey}`}>
											<a
												style={{
													padding: '0 8px',
													flexBasis: 100 / 7 + '%',
													flexShrink: 0,
													flexGrow: 0,
													width: 100 / 7 + '%',
													color: 'black',
													textDecoration: 'none',
												}}
											>
												<div style={{ padding: '0 5%', background: '#f6f6f6', marginBottom: '8px' }}>
													<div
														style={{
															position: 'relative',
															width: '100%',
															paddingTop: '131.4%',
														}}
													>
														<img
															src={product.image}
															style={{
																position: 'absolute',
																top: '0',
																right: '5%',
																bottom: '0',
																left: '5%',
																width: '90%',
															}}
														/>
													</div>
												</div>
												<div
													style={{
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap',
														fontSize: '14px',
														fontWeight: 'bold',
														marginBottom: '4px',
													}}
												>
													{product.brand}
												</div>
												<div
													style={{
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap',
														fontSize: '14px',
														marginBottom: '4px',
													}}
												>
													{product.name}
												</div>
												<div>
													<span
														style={{
															color: 'grey',
															textDecoration: 'line-through',
															fontSize: '14px',
														}}
													>
														{product.originalPrice} kr
													</span>
													<span
														style={{
															color: 'red',
															marginLeft: '8px',
															fontSize: '14px',
														}}
													>
														{product.specialPrice} kr
													</span>
												</div>
											</a>
										</NextLink>
									))}
								</div>
							</div>
						</React.Fragment>
					)}
				</React.Fragment>
			)} */

export default SearchResultsView;
