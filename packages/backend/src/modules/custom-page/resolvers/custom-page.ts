import { CustomPageModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { CustomPageProvider } from '../custom-page.provider';

const resolvers: CustomPageModuleResolversType = {
	CustomPage: {
		id: ({ id }) => toGlobalId('CustomPage', id),
		metaDescription: async ({ id }, _args, { injector }) => {
			const page = await injector.get(CustomPageProvider).getCustomPage({ id });
			return page.metaDescription;
		},
		metaKeywords: async ({ id }, _args, { injector }) => {
			const page = await injector.get(CustomPageProvider).getCustomPage({ id });
			return page.metaKeywords;
		},
		metaTitle: async ({ id }, _args, { injector }) => {
			const page = await injector.get(CustomPageProvider).getCustomPage({ id });
			return page.metaTitle;
		},
		path: async ({ id }, _args, { injector }) => {
			const page = await injector.get(CustomPageProvider).getCustomPage({ id });
			return page.path;
		},
		sections: async ({ id }, _args, { injector }) => {
			const sections = await injector.get(CustomPageProvider).getCustomPageSectionsByPage(id);
			return sections.map(({ id }) => ({ id }));
		},
	},
};

export default resolvers;
