import { CategoryModuleResolversType } from '..';
import { Category } from '../../../magento-sync';
import { fromGlobalId } from '../../../utils/global-id';
import { CategoryProvider } from '../category.provider';

const resolvers: CategoryModuleResolversType = {
	Query: {
		category: async (_parent, { where }, { injector }) => {
			let category: Category;
			const { urlKey, id: globalId } = where;
			if (urlKey) {
				category = await injector.get(CategoryProvider).getCategoryByUrlKey(urlKey);
			} else if (globalId) {
				const { id } = fromGlobalId(globalId);
				category = await injector.get(CategoryProvider).getCategory(id);
			} else {
				throw new Error('At least one identifier must be provided');
			}

			return { id: String(category.id) };
		},
		categories: async (_parent, _args, { injector }) => {
			const categories = await injector.get(CategoryProvider).getCategoryIds();
			return categories.map(id => ({ id }));
		},
	},
};

export default resolvers;
