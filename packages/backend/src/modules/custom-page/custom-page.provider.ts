import { Injectable, ProviderScope } from '@graphql-modules/di';
import { getRepository, Repository } from 'typeorm';

import { CustomPage } from '../../entities/custom-page';
import { CustomPageBannerComponent } from '../../entities/custom-page-banner-component';
import { CustomPageProductCarouselComponent } from '../../entities/custom-page-product-carousel-component';
import { CustomPageSection } from '../../entities/custom-page-section';
import { CustomPageTabComponent } from '../../entities/custom-page-tab-component';
import { CustomPageTabComponentSection } from '../../entities/custom-page-tab-component-section';
import { CustomPageTripleImageComponent } from '../../entities/custom-page-triple-image-component';

@Injectable({ scope: ProviderScope.Request })
export class CustomPageProvider {
	private customPageRepository: Repository<CustomPage>;
	private customPageSectionRepository: Repository<CustomPageSection>;
	private customPageBannerRepository: Repository<CustomPageBannerComponent>;
	private customPageProductCarouselRepository: Repository<CustomPageProductCarouselComponent>;
	private customPageTabsRepository: Repository<CustomPageTabComponent>;
	private customPageTabSectionsRepository: Repository<CustomPageTabComponentSection>;
	private customPageTripleImageRepository: Repository<CustomPageTripleImageComponent>;
	constructor() {
		this.customPageRepository = getRepository(CustomPage);
		this.customPageSectionRepository = getRepository(CustomPageSection);
		this.customPageBannerRepository = getRepository(CustomPageBannerComponent);
		this.customPageProductCarouselRepository = getRepository(CustomPageProductCarouselComponent);
		this.customPageTabsRepository = getRepository(CustomPageTabComponent);
		this.customPageTabSectionsRepository = getRepository(CustomPageTabComponentSection);
		this.customPageTripleImageRepository = getRepository(CustomPageTripleImageComponent);
	}

	getCustomPages() {
		return this.customPageRepository.find();
	}

	getCustomPage({ id, path }: { id?: string | null; path?: string | null }) {
		if (id) {
			return this.getCustomPageById(id);
		}

		if (path) {
			return this.getCustomPageByPath(path);
		}

		throw new Error('Must provider id or path');
	}

	async getCustomPageById(id: string) {
		const page = await this.customPageRepository.findOne(id);
		if (!page) {
			throw new Error('Custom page not found: ' + id);
		}

		return page;
	}

	async getCustomPageByPath(path: string) {
		const page = await this.customPageRepository.findOne({ where: { path } });
		if (!page) {
			throw new Error('Custom page not found: ' + path);
		}

		return page;
	}

	async getCustomPageSectionsByPage(pageId: string) {
		const sections = await this.customPageSectionRepository.find({
			where: { page: { id: pageId } },
			order: { position: 'ASC' },
		});
		if (!sections) {
			throw new Error('Custom page not found: ' + pageId);
		}

		return sections;
	}

	async getCustomPageSection(id: string) {
		const section = await this.customPageSectionRepository.findOne(id);
		if (!section) {
			throw new Error('Section not found: ' + id);
		}

		return section;
	}

	async getCustomPageBanner(id: string) {
		const banner = await this.customPageBannerRepository.findOne(id);
		if (!banner) {
			throw new Error('Banner component not found: ' + id);
		}

		return banner;
	}

	async getCustomPageProductCarousel(id: string) {
		const carousel = await this.customPageProductCarouselRepository.findOne(id);
		if (!carousel) {
			throw new Error('Product carousel component not found: ' + id);
		}

		return carousel;
	}

	async getCustomPageTab(id: string) {
		const tab = await this.customPageTabsRepository.findOne(id);
		if (!tab) {
			throw new Error('Tab component not found: ' + id);
		}

		return tab;
	}

	async getCustomPageTabSectionsByTab(tabId: string) {
		const tabSections = await this.customPageTabSectionsRepository.find({ where: { tab: { id: tabId } } });
		if (!tabSections) {
			throw new Error('Tab component not found: ' + tabId);
		}

		return tabSections;
	}

	async getCustomPageTabSection(id: string) {
		const tabSection = await this.customPageTabSectionsRepository.findOne(id);
		if (!tabSection) {
			throw new Error('Tab section not found: ' + id);
		}

		return tabSection;
	}

	async getCustomPageTripleImage(id: string) {
		const tripleImage = await this.customPageTripleImageRepository.findOne(id);
		if (!tripleImage) {
			throw new Error('Triple image component not found: ' + id);
		}

		return tripleImage;
	}
}
