import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { BrandModule } from '../brand';
import { ProductModule } from '../product';

export interface SearchModuleContext {}

export type SearchModuleResolversType = GQLResolvers<ModuleContext<SearchModuleContext>>;

export const SearchModule = new GraphQLModule<any, ApolloContext, SearchModuleContext>({
	imports: [BrandModule, ProductModule],
	providers: [],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
