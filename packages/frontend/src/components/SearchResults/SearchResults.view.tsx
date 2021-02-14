import React from 'react';

import Link from 'next/link';
import { graphql, QueryRenderer } from 'react-relay';
import { useRelayEnvironment } from 'react-relay/hooks';

import { SearchResultsSearchQuery } from './__generated__/SearchResultsSearchQuery.graphql';
import {
	NoResult,
	ProductBrand,
	ProductImage,
	ProductImagePositionWrapper,
	ProductImageStyleWrapper,
	ProductName,
	ProductOriginalPrice,
	ProductSection,
	ProductSpecialPrice,
	Section,
	SectionHeader,
	SectionItemLink,
	SectionItemsContainer,
	SectionProductLink,
	SectionProductsContainer,
	SectionProductWrapper,
	SectionsWrapper,
} from './SearchResult.styles';

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
interface SearchResultsViewProps {
	query: string;
	onResultSelected?: () => void;
}

const SearchResultsView = ({ query, onResultSelected }: SearchResultsViewProps) => {
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
													<SectionItemLink onClick={() => onResultSelected && onResultSelected()}>
														{brand.name}
													</SectionItemLink>
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
													<SectionItemLink onClick={() => onResultSelected && onResultSelected()}>
														{category.name}
													</SectionItemLink>
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
													<SectionProductLink onClick={() => onResultSelected && onResultSelected()}>
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
