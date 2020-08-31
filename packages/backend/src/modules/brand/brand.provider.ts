import { Injectable, ProviderScope } from '@graphql-modules/di';

import { getBrands } from '../../magento-sync';

@Injectable({ scope: ProviderScope.Request })
export class BrandProvider {
	getBrands() {
		return getBrands();
	}
}
