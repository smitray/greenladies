import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { RelayModule } from '../relay';

import { BrandProvider } from './brand.provider';

export interface BrandModuleContext {}

export type BrandModuleResolversType = GQLResolvers<ModuleContext<BrandModuleContext>>;

export const BrandModule = new GraphQLModule<any, ApolloContext, BrandModuleContext>({
	imports: [RelayModule],
	providers: [BrandProvider],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
