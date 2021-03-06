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

			if (!category.includeInMenu) {
				throw new Error('Invalid');
			}

			return { id: String(category.id) };
		},
		categories: async (_parent, _args, { injector }) => {
			return (await injector.get(CategoryProvider).getCategories()).filter(({ includeInMenu }) => includeInMenu);
		},
		rootCategories: (_parent, _args, { injector }) => {
			return injector.get(CategoryProvider).getRootCategories();
		},
		specialCategory: async (_parent, { where }, { injector }) => {
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

			if (category.includeInMenu) {
				throw new Error('Invalid');
			}

			return { id: String(category.id) };
		},
		specialCategories: async (_parent, _args, { injector }) => {
			return (await injector.get(CategoryProvider).getCategories()).filter(({ includeInMenu }) => !includeInMenu);
		},
	},
};

export default resolvers;
