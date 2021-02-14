import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { RelayModule } from '../relay';

export interface FileModuleContext {}

export type FileModuleResolversType = GQLResolvers<ModuleContext<FileModuleContext>>;

export const FileModule = new GraphQLModule<any, ApolloContext, FileModuleContext>({
	imports: [RelayModule],
	providers: [],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
