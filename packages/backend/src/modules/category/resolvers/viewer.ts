import { CategoryModuleResolversType } from '..';
import { CategoryProvider } from '../category.provider';

const resolvers: CategoryModuleResolversType = {
	Viewer: {
		categories: async (_parent, _args, { injector }) => {
			const categories = await injector.get(CategoryProvider).getRootCategory();

			return categories.map(({ id }) => ({ id: String(id) }));
		},
	},
};

export default resolvers;
