import { CustomPageModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { CustomPageProvider } from '../custom-page.provider';

const resolvers: CustomPageModuleResolversType = {
	CustomPageSection: {
		id: ({ id }) => toGlobalId('CustomPageSection', id),
		position: async ({ id }, _args, { injector }) => {
			const section = await injector.get(CustomPageProvider).getCustomPageSection(id);
			return section.position;
		},
		section: async ({ id }, _args, { injector }) => {
			const section = await injector.get(CustomPageProvider).getCustomPageSection(id);
			switch (section.type) {
				case 'banner': {
					return {
						__typename: 'CustomPageBanner',
						id: section.componentId,
					};
				}
				case 'product-carousel': {
					return {
						__typename: 'CustomPageProductCarousel',
						id: section.componentId,
					};
				}
				case 'tabs': {
					return {
						__typename: 'CustomPageTab',
						id: section.componentId,
					};
				}
				case 'triple-image': {
					return {
						__typename: 'CustomPageTripleImage',
						id: section.componentId,
					};
				}
				default:
					throw new Error('Invalid section type: ' + section.type);
			}
		},
	},
};

export default resolvers;
