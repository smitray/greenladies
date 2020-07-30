import { CategoryModuleResolversType } from '..';
import { Category } from '../../../magento-sync';
import { CategoryProvider } from '../category.provider';

const resolvers: CategoryModuleResolversType = {
	Query: {
		category: async (_parent, { where }, { injector }) => {
			let category: Category;
			const { urlKey, id } = where;
			if (urlKey) {
				category = await injector.get(CategoryProvider).getCategoryByUrlKey(urlKey);
			} else if (id) {
				category = await injector.get(CategoryProvider).getCategory(id);
			} else {
				throw new Error('At least one identifier must be provided');
			}

			return { id: String(category.id) };
		},
	},
};

export default resolvers;
