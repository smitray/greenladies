import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import Express from 'express';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { AuthModule } from '../auth';
import { CategoryModule } from '../category';
import { RelayModule } from '../relay';

import { ProductProvider } from './product.provider';

export interface ProductModuleContext {
	request: Express.Request;
}

export type ProductModuleResolversType = GQLResolvers<ModuleContext<ProductModuleContext>>;

export const ProductModule = new GraphQLModule<any, ApolloContext, ProductModuleContext>({
	imports: [AuthModule, CategoryModule, RelayModule],
	providers: [ProductProvider],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
	context: ({ req }) => {
		return {
			request: req,
		};
	},
});
