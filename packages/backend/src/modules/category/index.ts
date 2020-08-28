import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { RelayModule } from '../relay';

import { CategoryProvider } from './category.provider';

export interface CategoryModuleContext {}

export type CategoryModuleResolversType = GQLResolvers<ModuleContext<CategoryModuleContext>>;

export const CategoryModule = new GraphQLModule<any, ApolloContext, CategoryModuleContext>({
	imports: [RelayModule],
	providers: [CategoryProvider],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
