import { getRepository } from 'typeorm';

import { CustomPageModuleResolversType } from '..';
import { GQLCustomPageSection } from '../../../__generated__/types';
import { CustomPage } from '../../../entities/custom-page';
import { CustomPageBannerComponent } from '../../../entities/custom-page-banner-component';
import { CustomPageProductCarouselComponent } from '../../../entities/custom-page-product-carousel-component';
import { CustomPageTabComponent } from '../../../entities/custom-page-tab-component';
import { connectionFromArray } from '../../../utils/relay';
import { ProductProvider } from '../../product/product.provider';

const resolvers: CustomPageModuleResolversType = {
	Query: {
		customPage: async (_parent, { path }, { injector }) => {
			const customPageRepo = getRepository(CustomPage);
			const page = await customPageRepo.findOne({
				where: { path },
				relations: ['sections'],
			});
			if (!page) {
				throw new Error('PAGE_NOT_FOUND');
			}

			const sections = await Promise.all(
				page.sections.map<Promise<GQLCustomPageSection>>(async section => {
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
								tabs: tab.sections,
							};
						}
						case 'product-carousel': {
							const customPageProductCarouselRepo = getRepository(CustomPageProductCarouselComponent);
							const carousel = await customPageProductCarouselRepo.findOne({ where: { id: section.componentId } });
							if (!carousel) {
								throw new Error('Component link not found');
							}

							const products = await injector
								.get(ProductProvider)
								.getProductConfigurationsByCategoryId(carousel.categoryId);

							return {
								__typename: 'CustomPageProductCarousel',
								title: carousel.title,
								subtitle: carousel.subtitle,
								products: {
									...connectionFromArray(products as any, {}),
									availableFilters: {
										brands: [],
										colors: [],
										price: {
											from: 0,
											to: 0,
										},
										sizes: [],
									},
								},
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
				sections,
			};
		},
	},
};

export default resolvers;