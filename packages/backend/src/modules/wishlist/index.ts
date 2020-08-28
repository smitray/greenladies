import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import { Request } from 'express';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { ProductModule } from '../product';
import { RelayModule } from '../relay';

export interface WishlistModuleContext {
	request: Request;
}

export type WishlistModuleResolversType = GQLResolvers<ModuleContext<WishlistModuleContext>>;

export const WishlistModule = new GraphQLModule<any, ApolloContext, WishlistModuleContext>({
	imports: [ProductModule, RelayModule],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
	context: ({ req }) => {
		return {
			request: req,
		};
	},
});
