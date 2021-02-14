import { CustomPageModuleResolversType } from '..';
import { apiLocation } from '../../../utils/domain';
import { toGlobalId } from '../../../utils/global-id';
import { transformLink } from '../../link/utils/transform-link';
import { CustomPageProvider } from '../custom-page.provider';

const resolvers: CustomPageModuleResolversType = {
	CustomPageTripleImage: {
		id: ({ id }) => toGlobalId('CustomPageTripleImage', id),
		bigTitle: async ({ id }, _args, { injector }) => {
			const tripleImage = await injector.get(CustomPageProvider).getCustomPageTripleImage(id);
			return tripleImage.bigTitle;
		},
		color: async ({ id }, _args, { injector }) => {
			const tripleImage = await injector.get(CustomPageProvider).getCustomPageTripleImage(id);
			return tripleImage.color;
		},
		firstImagePath: async ({ id }, _args, { injector }) => {
			const tripleImage = await injector.get(CustomPageProvider).getCustomPageTripleImage(id);
			return apiLocation() + tripleImage.firstImagePath;
		},
		link: async ({ id }, _args, { injector }) => {
			const tripleImage = await injector.get(CustomPageProvider).getCustomPageTripleImage(id);
			return transformLink(tripleImage.link);
		},
		mobileImagePath: async ({ id }, _args, { injector }) => {
			const tripleImage = await injector.get(CustomPageProvider).getCustomPageTripleImage(id);
			return apiLocation() + tripleImage.mobileImagePath;
		},
		secondImagePath: async ({ id }, _args, { injector }) => {
			const tripleImage = await injector.get(CustomPageProvider).getCustomPageTripleImage(id);
			return apiLocation() + tripleImage.secondImagePath;
		},
		smallTitle: async ({ id }, _args, { injector }) => {
			const tripleImage = await injector.get(CustomPageProvider).getCustomPageTripleImage(id);
			return tripleImage.smallTitle;
		},
		thirdImagePath: async ({ id }, _args, { injector }) => {
			const tripleImage = await injector.get(CustomPageProvider).getCustomPageTripleImage(id);
			return apiLocation() + tripleImage.thirdImagePath;
		},
	},
};

export default resolvers;
