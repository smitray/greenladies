import { CustomPageModuleResolversType } from '..';
import { apiLocation } from '../../../utils/domain';
import { toGlobalId } from '../../../utils/global-id';
import { transformLink } from '../../link/utils/transform-link';
import { CustomPageProvider } from '../custom-page.provider';

const resolvers: CustomPageModuleResolversType = {
	CustomPageBanner: {
		id: ({ id }) => toGlobalId('CustomPageBanner', id),
		imagePath: async ({ id }, _args, { injector }) => {
			const banner = await injector.get(CustomPageProvider).getCustomPageBanner(id);
			return apiLocation() + banner.imagePath;
		},
		link: async ({ id }, _args, { injector }) => {
			const banner = await injector.get(CustomPageProvider).getCustomPageBanner(id);
			return transformLink(banner.link);
		},
		mobileImagePath: async ({ id }, _args, { injector }) => {
			const banner = await injector.get(CustomPageProvider).getCustomPageBanner(id);
			return apiLocation() + banner.mobileImagePath;
		},
		subtitle: async ({ id }, _args, { injector }) => {
			const banner = await injector.get(CustomPageProvider).getCustomPageBanner(id);
			return banner.subtitle;
		},
		textColor: async ({ id }, _args, { injector }) => {
			const banner = await injector.get(CustomPageProvider).getCustomPageBanner(id);
			return banner.textColor;
		},
		title: async ({ id }, _args, { injector }) => {
			const banner = await injector.get(CustomPageProvider).getCustomPageBanner(id);
			return banner.title;
		},
	},
};

export default resolvers;
