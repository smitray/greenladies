import { CustomPageModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { CustomPageProvider } from '../custom-page.provider';

const resolvers: CustomPageModuleResolversType = {
	CustomPageTabSection: {
		id: ({ id }) => toGlobalId('CustomPageTabSection', id),
		body: async ({ id }, _args, { injector }) => {
			const tabSection = await injector.get(CustomPageProvider).getCustomPageTabSection(id);
			return tabSection.body;
		},
		key: async ({ id }, _args, { injector }) => {
			const tabSection = await injector.get(CustomPageProvider).getCustomPageTabSection(id);
			return tabSection.key;
		},
		title: async ({ id }, _args, { injector }) => {
			const tabSection = await injector.get(CustomPageProvider).getCustomPageTabSection(id);
			return tabSection.title;
		},
	},
};

export default resolvers;
