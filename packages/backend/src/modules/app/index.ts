import { GraphQLModule } from '@graphql-modules/core';

import { CategoryModule } from '../category';
import { ProductModule } from '../product';
import { RelayModule } from '../relay';
import { ShoppingCartModule } from '../shopping-cart';

export const AppModule = new GraphQLModule({
	imports: [CategoryModule, ProductModule, RelayModule, ShoppingCartModule],
});
