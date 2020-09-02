import { Injectable, ProviderScope } from '@graphql-modules/di';

import { getBrand, getBrands } from '../../magento-sync';

@Injectable({ scope: ProviderScope.Request })
export class BrandProvider {
	getBrands() {
		return getBrands();
	}

	getBrand(identifiers: { id?: string | null; name?: string | null }) {
		return getBrand(identifiers);
	}
}
