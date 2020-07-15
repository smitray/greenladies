import { GraphQLModule } from '@graphql-modules/core';

import { RelayModule } from '../relay';
import { TestModule } from '../test';

export const AppModule = new GraphQLModule({
	imports: [RelayModule, TestModule],
});
