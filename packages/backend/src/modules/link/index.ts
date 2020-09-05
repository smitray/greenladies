import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { BrandModule } from '../brand';
import { CategoryModule } from '../category';
import { ProductModule } from '../product';

export interface LinkModuleContext {}

export type LinkModuleResolversType = GQLResolvers<ModuleContext<LinkModuleContext>>;

export const LinkModule = new GraphQLModule<any, ApolloContext, LinkModuleContext>({
	imports: [BrandModule, CategoryModule, ProductModule],
	providers: [],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
