import { CategoryModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { CategoryProvider } from '../category.provider';

const resolvers: CategoryModuleResolversType = {
	Category: {
		id: ({ id }) => {
			return toGlobalId('Category', id);
		},
		urlKey: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			return category.urlKey;
		},
		name: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			return category.name;
		},
		children: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			if (category.childrenIds.length === 0) {
				return [];
			}

			return category.childrenIds.map(id => ({ id }));
		},
		parent: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			// The category with id=2 is the default category (root)
			if (category.parentId === '2') {
				return null;
			}

			return { id: String(category.parentId) };
		},
	},
};

export default resolvers;
