import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { RelayModule } from '../relay';

export interface TestModuleContext {}

export type TestModuleResolversType = GQLResolvers<ModuleContext<TestModuleContext>>;

export const TestModule = new GraphQLModule<any, ApolloContext, TestModuleContext>({
	imports: [RelayModule],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.ts')),
});
