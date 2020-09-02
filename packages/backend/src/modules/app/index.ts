import { GraphQLModule } from '@graphql-modules/core';

import { BrandModule } from '../brand';
import { CategoryModule } from '../category';
import { OrderModule } from '../order';
import { ProductModule } from '../product';
import { RelayModule } from '../relay';
import { SearchModule } from '../search';
import { ShoppingCartModule } from '../shopping-cart';
import { WishlistModule } from '../wishlist';

export const AppModule = new GraphQLModule({
	imports: [
		BrandModule,
		CategoryModule,
		OrderModule,
		ProductModule,
		RelayModule,
		SearchModule,
		ShoppingCartModule,
		WishlistModule,
	],
});
