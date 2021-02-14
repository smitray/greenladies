import { CustomPageModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { CustomPageProvider } from '../custom-page.provider';

const resolvers: CustomPageModuleResolversType = {
	CustomPageProductCarousel: {
		id: ({ id }) => toGlobalId('CustomPageProductCarousel', id),
		category: async ({ id }, _args, { injector }) => {
			const carousel = await injector.get(CustomPageProvider).getCustomPageProductCarousel(id);
			return { id: carousel.categoryId };
		},
		subtitle: async ({ id }, _args, { injector }) => {
			const carousel = await injector.get(CustomPageProvider).getCustomPageProductCarousel(id);
			return carousel.subtitle;
		},
		title: async ({ id }, _args, { injector }) => {
			const carousel = await injector.get(CustomPageProvider).getCustomPageProductCarousel(id);
			return carousel.title;
		},
	},
};

export default resolvers;
