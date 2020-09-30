import { getRepository } from 'typeorm';

import { CustomPageModuleResolversType } from '..';
import { GQLCustomPageSection } from '../../../__generated__/types';
import { CustomPage } from '../../../entities/custom-page';
import { CustomPageBannerComponent } from '../../../entities/custom-page-banner-component';
import { CustomPageProductCarouselComponent } from '../../../entities/custom-page-product-carousel-component';
import { CustomPageTabComponent } from '../../../entities/custom-page-tab-component';
import { transformLink } from '../../link/utils/transform-link';

const resolvers: CustomPageModuleResolversType = {
	Query: {
		customPage: async (_parent, { path }) => {
			const customPageRepo = getRepository(CustomPage);
			const page = await customPageRepo.findOne({
				where: { path },
				relations: ['sections'],
			});
			if (!page) {
				throw new Error('PAGE_NOT_FOUND');
			}

			const sections = await Promise.all(
				page.sections
					.sort((left, right) => left.position - right.position)
					.map<Promise<GQLCustomPageSection>>(async section => {
						switch (section.type) {
							case 'tabs': {
								const customPageTabComponentRepo = getRepository(CustomPageTabComponent);
								const tab = await customPageTabComponentRepo.findOne({
									where: { id: section.componentId },
									relations: ['sections'],
								});
								if (!tab) {
									throw new Error('Component link not found');
								}

								return {
									__typename: 'CustomPageTab',
									tabs: tab.sections.sort((left, right) => left.position - right.position),
								};
							}
							case 'product-carousel': {
								const customPageProductCarouselRepo = getRepository(CustomPageProductCarouselComponent);
								const carousel = await customPageProductCarouselRepo.findOne({ where: { id: section.componentId } });
								if (!carousel) {
									throw new Error('Component link not found');
								}

								return {
									__typename: 'CustomPageProductCarousel',
									title: carousel.title,
									subtitle: carousel.subtitle,
									category: { id: carousel.categoryId } as any,
								};
							}
							case 'banner': {
								const customPageBannerComponentRepo = getRepository(CustomPageBannerComponent);
								const banner = await customPageBannerComponentRepo.findOne({ where: { id: section.componentId } });
								if (!banner) {
									throw new Error('Component link not found');
								}

								return {
									__typename: 'CustomPageBanner',
									title: banner.title,
									subtitle: banner.subtitle,
									link: transformLink(banner.link) as any,
									imagePath: banner.imagePath,
									mobileImagePath: banner.mobileImagePath,
								};
							}
							default:
								throw new Error('Invalid section type: ' + section.type);
						}
					}),
			);

			return {
				metaTitle: page.metaTitle,
				metaKeywords: page.metaKeywords,
				metaDescription: page.metaDescription,
				sections,
			};
		},
	},
};

export default resolvers;
