import { CategoryModuleResolversType } from '..';
import { MagentoFullCategory } from '../../../api/category';
import { CategoryProvider } from '../category.provider';

const resolvers: CategoryModuleResolversType = {
	Query: {
		categories: async (_parent, _args, { injector }) => {
			const categories = await injector.get(CategoryProvider).getCategories();

			return categories.map(({ id }) => ({ id: String(id) }));
		},
		category: async (_parent, { where }, { injector }) => {
			let category: MagentoFullCategory;
			const { key, id } = where;
			if (key) {
				category = await injector.get(CategoryProvider).getCategoryByKey(key);
			} else if (id) {
				if (parseInt(id, 10) <= 2) {
					throw new Error('Category not found');
				}

				category = await injector.get(CategoryProvider).getCategory(id);
			} else {
				throw new Error('At least one identifier must be provided');
			}

			return { id: String(category.id) };
		},
	},
};

export default resolvers;
