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
			const products = await injector.get(ProductProvider).getConfigurableProducts();
			const brands = await injector.get(BrandProvider).getBrands();

			console.log(brands);

			const listToSearch: SearchTarget[] = [
				...products.map(product => {
					return { ...product, __typename: 'Product' };
				}),
				...brands.map(brand => {
					return { ...brand, __typename: 'Brand' };
				}),
			];
			const options: Fuzzysort.KeyOptions = {
				limit: 16,
				threshold: -10000,
				key: 'name',
			};
			const results = fuzzysort.go(query, listToSearch, options);

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
