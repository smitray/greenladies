import { graphql } from 'relay-runtime';

import { customPageQuery } from './__generated__/customPageQuery.graphql';

export const CUSTOM_PAGE_QUERY = graphql`
	query customPageQuery($path: String!) {
		customPage(path: $path) {
			metaTitle
			metaKeywords
			metaDescription
			sections {
				__typename
				... on CustomPageBanner {
					...CustomPageBanner_banner
				}
				... on CustomPageProductCarousel {
					...CustomPageProductCarousel_carousel
				}
				... on CustomPageTab {
					...CustomPageTabs_tabs
				}
			}
		}
	}
`;

export type { customPageQuery as CustomPageQuery };
