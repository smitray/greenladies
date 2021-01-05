import { ApolloError } from 'apollo-server-express';

import { ProductModuleResolversType } from '..';
import { createProduct } from '../../../api/product';
import { CategoryProvider } from '../../category/category.provider';

const ALLOWED_COLORS = [
	'beige',
	'black',
	'blue',
	'brown',
	'darkgreen',
	'gold',
	'green',
	'grey',
	'multi',
	'orange',
	'pink',
	'purple',
	'red',
	'silver',
	'transparent',
	'white',
	'yellow',
];

const resolvers: ProductModuleResolversType = {
	Mutation: {
		createProducts: async (_parent, { input }, { injector, request }) => {
			if (!request.session) {
				throw new ApolloError('No session', 'NO_SESSION');
			}

			if (!request.session.auth) {
				throw new ApolloError('Must be logged in to perform action', 'NOT_AUTHENTICATED');
			}

			const categories = await injector.get(CategoryProvider).getCategories();
			for (const product of input.products) {
				const category = categories.find(category => category.name === product.categoryName);
				if (!category) {
					throw new ApolloError(product.categoryName, 'INVALID_CATEGORY');
				}

				const colors = product.color.split(',').map(color => color.trim());
				for (const color of colors) {
					console.log('checking color', color);
					if (!ALLOWED_COLORS.includes(color)) {
						console.log('invalid color', color);
						throw new ApolloError(color, 'INVALID_COLOR');
					}
				}
			}

			for (const product of input.products) {
				try {
					const category = categories.find(category => category.name === product.categoryName);

					await createProduct({
						...product,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						categoryId: category!.id,
						enabled: false,
					});
				} catch (error) {
					throw new ApolloError(product.baseSku, 'PRODUCT_CREATION_FAILED');
				}
			}

			return { success: true };
		},
	},
};

export default resolvers;
