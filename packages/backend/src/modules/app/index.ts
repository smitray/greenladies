import { GraphQLModule } from '@graphql-modules/core';

import { CategoryModule } from '../category';
import { RelayModule } from '../relay';

export const AppModule = new GraphQLModule({
	imports: [CategoryModule, RelayModule],
});
