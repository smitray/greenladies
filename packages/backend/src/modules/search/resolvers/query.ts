import fuzzysort from 'fuzzysort';

import { SearchModuleResolversType } from '..';
import { Node } from '../../../types';
import { BrandProvider } from '../../brand/brand.provider';
import { ProductProvider } from '../../product/product.provider';

interface SearchTarget extends Node {
	name: string;
}

const resolvers: SearchModuleResolversType = {
	Query: {
		search: async (_parent, { query }, { injector }) => {
			console.time('products');
			const products = await injector.get(ProductProvider).getConfigurableProducts();
			console.timeEnd('products');
			console.time('brands');
			const brands = await injector.get(BrandProvider).getBrands();
			console.timeEnd('brands');

			console.time('createlist');
			const listToSearch: SearchTarget[] = [
				...products.map(product => {
					return { ...product, __typename: 'Product' };
				}),
				...brands.map(brand => {
					return { ...brand, __typename: 'Brand' };
				}),
			];
			console.timeEnd('createlist');
			const options: Fuzzysort.KeyOptions = {
				limit: 16,
				threshold: -10000,
				key: 'name',
			};
			console.time('fuzzy');
			const results = fuzzysort.go(query, listToSearch, options);
			console.timeEnd('fuzzy');
			return {
				results: results.map(result => {
					return {
						node: result.obj,
						meta: {
							indices: result.indexes,
						},
					};
				}),
			};
		},
	},
};

export default resolvers;
