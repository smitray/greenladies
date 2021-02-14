import { CustomPageModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { CustomPageProvider } from '../custom-page.provider';

const resolvers: CustomPageModuleResolversType = {
	CustomPageTab: {
		id: ({ id }) => toGlobalId('CustomPageTab', id),
		tabs: async ({ id }, _args, { injector }) => {
			const tabSections = await injector.get(CustomPageProvider).getCustomPageTabSectionsByTab(id);
			return tabSections.map(({ id }) => ({ id }));
		},
	},
};

export default resolvers;
