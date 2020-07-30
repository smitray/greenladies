import { Injectable } from '@graphql-modules/di';

import { getProduct, getProductBySku, getProducts, getProductsByCategoryId } from '../../api/product';

@Injectable()
export class ProductProvider {
	getProducts() {
		return getProducts();
	}

	getProduct(id: string | number) {
		return getProduct(id);
	}

	getProductBySku(sku: string) {
		return getProductBySku(sku);
	}

	getProductsByCategoryId(categoryId: string) {
		return getProductsByCategoryId(categoryId);
	}
}
