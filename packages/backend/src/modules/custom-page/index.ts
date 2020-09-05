import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { CategoryModule } from '../category';
import { LinkModule } from '../link';
import { RelayModule } from '../relay';

export interface CustomPageModuleContext {}

export type CustomPageModuleResolversType = GQLResolvers<ModuleContext<CustomPageModuleContext>>;

export const CustomPageModule = new GraphQLModule<any, ApolloContext, CustomPageModuleContext>({
	imports: [CategoryModule, LinkModule, RelayModule],
	providers: [],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
