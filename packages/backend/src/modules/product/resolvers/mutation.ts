import { ProductModuleResolversType } from '..';
import { createProduct } from '../../../api/product';
import { CategoryProvider } from '../../category/category.provider';

const resolvers: ProductModuleResolversType = {
	Mutation: {
		createProducts: async (_parent, { input }, { injector, request }) => {
			if (!request.session) {
				throw new Error('No session');
			}

			if (!request.session.auth) {
				throw new Error('Must be logged in to perform action');
			}

			const categories = await injector.get(CategoryProvider).getCategories();
			for (const product of input.products) {
				const category = categories.find(category => category.name === product.categoryName);
				if (!category) {
					throw new Error('Invalid category: ' + product.categoryName);
				}
			}

			for (const product of input.products) {
				const category = categories.find(category => category.name === product.categoryName);

				await createProduct({
					...product,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					categoryId: category!.id,
					enabled: false,
				});
			}

			return { success: true };
		},
	},
};

export default resolvers;
