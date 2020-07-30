import { ProductModuleResolversType } from '..';
import { connectionFromArray } from '../../../utils/relay';
import { CategoryProvider } from '../../category/category.provider';

const resolvers: ProductModuleResolversType = {
	Category: {
		products: async ({ id }, args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			return connectionFromArray(
				category.productIds.map(id => ({ id })),
				args,
			);
		},
	},
};

export default resolvers;
