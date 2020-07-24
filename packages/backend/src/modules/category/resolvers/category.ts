import { CategoryModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { CategoryProvider } from '../category.provider';

const resolvers: CategoryModuleResolversType = {
	Category: {
		id: ({ id }) => {
			return toGlobalId('Category', id);
		},
		name: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			return category.name;
		},
		isActive: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			return category.is_active;
		},
		includeInMenu: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			return category.include_in_menu;
		},
		children: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			if (category.children.length === 0) {
				return [];
			}

			return category.children.split(',').map(id => ({ id }));
		},
		parent: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			return { id: String(category.parent_id) };
		},
	},
};

export default resolvers;
