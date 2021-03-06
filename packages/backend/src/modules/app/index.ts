import { GraphQLModule } from '@graphql-modules/core';

import { AuthModule } from '../auth';
import { BrandModule } from '../brand';
import { CategoryModule } from '../category';
import { CustomPageModule } from '../custom-page';
import { FileModule } from '../file';
import { MailchimpModule } from '../mailchimp';
import { MegamenuModule } from '../megamenu';
import { OrderModule } from '../order';
import { ProductModule } from '../product';
import { RelayModule } from '../relay';
import { SearchModule } from '../search';
import { ShoppingCartModule } from '../shopping-cart';
import { UserModule } from '../user';
import { WishlistModule } from '../wishlist';

export const AppModule = new GraphQLModule({
	imports: [
		AuthModule,
		BrandModule,
		CategoryModule,
		CustomPageModule,
		FileModule,
		MailchimpModule,
		MegamenuModule,
		OrderModule,
		ProductModule,
		RelayModule,
		SearchModule,
		ShoppingCartModule,
		UserModule,
		WishlistModule,
	],
});
