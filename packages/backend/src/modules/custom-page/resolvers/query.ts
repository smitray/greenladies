import { CustomPageModuleResolversType } from '..';
import { CustomPageProvider } from '../custom-page.provider';

const resolvers: CustomPageModuleResolversType = {
	Query: {
		customPage: async (_parent, { path }, { injector }) => {
			const page = await injector.get(CustomPageProvider).getCustomPage({ path });
			if (!page) {
				throw new Error('PAGE_NOT_FOUND');
			}

			return { id: page.id };
		},
		customPages: async (_parent, _args, { injector }) => {
			const pages = await injector.get(CustomPageProvider).getCustomPages();

			return pages.map(({ id }) => ({ id }));
		},
	},
};

export default resolvers;
