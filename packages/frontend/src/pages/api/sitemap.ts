import { gql, GraphQLClient } from 'graphql-request';
import { NextApiRequest, NextApiResponse } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		const smStream = new SitemapStream({
			hostname: `https://${req.headers.host}`,
		});

		// Create each URL row
		smStream.write({
			url: `/`,
			changefreq: 'daily',
			priority: 1,
		});

		smStream.write({
			url: `/kundservice?tab=om-green-ladies`,
			changefreq: 'daily',
			priority: 0.9,
		});

		smStream.write({
			url: `/categories/all`,
			changefreq: 'daily',
			priority: 0.6,
		});

		smStream.write({
			url: `/brands`,
			changefreq: 'daily',
			priority: 0.6,
		});

		const client = new GraphQLClient('http://backend:3000/graphql');

		const { categories } = await client.request<{ categories: { urlKey: string }[] }>(gql`
			query CategoriesQuery {
				categories {
					urlKey
				}
			}
		`);

		const { specialCategories } = await client.request<{ specialCategories: { urlKey: string }[] }>(gql`
			query SpecialCategoriesQuery {
				specialCategories {
					urlKey
				}
			}
		`);

		const { products } = await client.request<{ products: { edges: { node: { urlKey: string } }[] } }>(gql`
			query ProductsQuery {
				products(orderBy: created_DESC, first: 10000) {
					edges {
						node {
							urlKey
						}
					}
				}
			}
		`);

		categories.forEach(category => {
			smStream.write({
				url: `/categories/${category.urlKey}`,
				changefreq: 'daily',
				priority: 0.5,
			});
		});

		specialCategories.forEach(category => {
			smStream.write({
				url: `/categories/special/${category.urlKey}`,
				changefreq: 'daily',
				priority: 0.5,
			});
		});

		products.edges.forEach(({ node: product }) => {
			smStream.write({
				url: `/products/${product.urlKey}`,
				changefreq: 'daily',
				priority: 0.5,
			});
		});

		// End sitemap stream
		smStream.end();

		// XML sitemap string
		const sitemapOutput = (await streamToPromise(smStream)).toString();

		// Change headers
		res.writeHead(200, {
			'Content-Type': 'application/xml',
		});

		// Display output to user
		res.end(sitemapOutput);
	} catch (e) {
		res.send(JSON.stringify(e));
	}
}
