import { Injectable, ProviderScope } from '@graphql-modules/di';

import { getConfigurableProduct, getConfigurableProducts, getProductConfiguration } from '../../magento-sync';
import { CategoryProvider } from '../category/category.provider';

@Injectable({ scope: ProviderScope.Request })
export class ProductProvider {
	constructor(private categoryProvider: CategoryProvider) {}

	async getConfigurableProducts() {
		return getConfigurableProducts();
	}

	getConfigurableProduct(identifiers: { id?: string | null; sku?: string | null; urlKey?: string | null }) {
		return getConfigurableProduct(identifiers);
	}

	getProductConfiguration(identifiers: { id?: string | null; sku?: string | null }) {
		return getProductConfiguration(identifiers);
	}

	async getProductConfigurationsByCategoryId(id: string) {
		const category = await this.categoryProvider.getCategory(id);
		return Promise.all(category.productIds.map(id => getConfigurableProduct({ id })));
	}
}
