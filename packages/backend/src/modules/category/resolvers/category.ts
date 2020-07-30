import { CategoryModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { CategoryProvider } from '../category.provider';

const resolvers: CategoryModuleResolversType = {
	Category: {
		id: ({ id }) => {
			return toGlobalId('Category', id);
		},
		key: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			return category.custom_attributes.find(attribute => attribute.attribute_code === 'url_key')?.value || '';
		},
		name: async ({ id }, _args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			return category.name;
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

			// The category with id=2 is the default category (root)
			if (category.parent_id === 2) {
				return null;
			}

			return { id: String(category.parent_id) };
		},
	},
};

export default resolvers;
