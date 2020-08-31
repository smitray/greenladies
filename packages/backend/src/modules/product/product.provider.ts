import { Injectable, ProviderScope } from '@graphql-modules/di';

import { getConfigurableProduct, getConfigurableProducts, getProductConfiguration } from '../../magento-sync';

@Injectable({ scope: ProviderScope.Request })
export class ProductProvider {
	async getConfigurableProducts() {
		return getConfigurableProducts();
	}

	getConfigurableProduct(identifiers: { id?: string | null; sku?: string | null; urlKey?: string | null }) {
		return getConfigurableProduct(identifiers);
	}

	getProductConfiguration(identifiers: { id?: string | null; sku?: string | null }) {
		return getProductConfiguration(identifiers);
	}
}
