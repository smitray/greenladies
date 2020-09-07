import fuzzysort from 'fuzzysort';

import { SearchModuleResolversType } from '..';
import { BrandProvider } from '../../brand/brand.provider';
import { CategoryProvider } from '../../category/category.provider';
import { ProductProvider } from '../../product/product.provider';

const resolvers: SearchModuleResolversType = {
	Query: {
		search: async (_parent, { query }, { injector }) => {
			const products = await injector.get(ProductProvider).getConfigurableProducts();
			const brands = await injector.get(BrandProvider).getBrands();
			const categories = await injector.get(CategoryProvider).getCategories();

			// console.log(products);

			const foundProductsPromise = fuzzysort.goAsync(query, products, {
				allowTypo: true,
				limit: 16,
				threshold: -10000,
				keys: ['name', 'description.full'],
				scoreFn: keysResult => {
					const nameResult = keysResult[0] ? keysResult[0].score : -1000;
					const descriptionResult = keysResult[1] ? keysResult[1].score - 100 : -1000;
					return Math.max(nameResult, descriptionResult);
				},
			});
			const foundBrandsPromise = fuzzysort.goAsync(query, brands, {
				allowTypo: true,
				limit: 8,
				threshold: -10000,
				key: 'name',
			});
			const foundCategoriesPromise = fuzzysort.goAsync(query, categories, {
				allowTypo: true,
				limit: 16,
				threshold: -10000,
				key: 'name',
			});
			const [foundProducts, foundBrands, foundCategories] = await Promise.all([
				foundProductsPromise,
				foundBrandsPromise,
				foundCategoriesPromise,
			]);

			return {
				brands: foundBrands.map(foundBrand => ({ id: foundBrand.obj.id })),
				categories: foundCategories.map(foundCategory => ({ id: foundCategory.obj.id })),
				products: foundProducts.map(foundProduct => ({ id: foundProduct.obj.id })),
			};
		},
	},
};

export default resolvers;
