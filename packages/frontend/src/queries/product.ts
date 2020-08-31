import { graphql } from 'relay-runtime';

import { productQuery } from './__generated__/productQuery.graphql';

export const PRODUCT_QUERY = graphql`
	query productQuery($where: ProductWhereUniqueInput!) {
		product(where: $where) {
			...ProductImageGallery_product
			...ProductDetails_product
			relatedProducts(first: 25) {
				totalCount
				...ProductCarousel_products
			}
		}
	}
`;

export type { productQuery as ProductQuery };
