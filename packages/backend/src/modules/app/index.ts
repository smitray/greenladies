import { GraphQLModule } from '@graphql-modules/core';

import { CategoryModule } from '../category';
import { OrderModule } from '../order';
import { ProductModule } from '../product';
import { RelayModule } from '../relay';
import { ShoppingCartModule } from '../shopping-cart';
import { WishlistModule } from '../wishlist';

export const AppModule = new GraphQLModule({
	imports: [CategoryModule, OrderModule, ProductModule, RelayModule, ShoppingCartModule, WishlistModule],
});
