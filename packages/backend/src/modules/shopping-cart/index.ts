import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import { Request } from 'express';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
// import { CategoryModule } from '../category';
// import { RelayModule } from '../relay';

// import { ShoppingCartProvider } from './shopping-cart.provider';

export interface ShoppingCartModuleContext {
	request: Request;
}

export type ShoppingCartModuleResolversType = GQLResolvers<ModuleContext<ShoppingCartModuleContext>>;

export const ShoppingCartModule = new GraphQLModule<any, ApolloContext, ShoppingCartModuleContext>({
	// imports: [CategoryModule, RelayModule],
	// providers: [ShoppingCartProvider],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.ts')),
	context: ({ req }) => {
		return {
			request: req,
		};
	},
});
