import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { LinkModule } from '../link';

export interface MegamenuModuleContext {}

export type MegamenuModuleResolversType = GQLResolvers<ModuleContext<MegamenuModuleContext>>;

export const MegamenuModule = new GraphQLModule<any, ApolloContext, MegamenuModuleContext>({
	imports: [LinkModule],
	providers: [],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
