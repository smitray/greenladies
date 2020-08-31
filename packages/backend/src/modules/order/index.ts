import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';

import { OrderProvider } from './order.provider';

export interface OrderModuleContext {}

export type OrderModuleResolversType = GQLResolvers<ModuleContext<OrderModuleContext>>;

export const OrderModule = new GraphQLModule<any, ApolloContext, OrderModuleContext>({
	imports: [],
	providers: [OrderProvider],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
