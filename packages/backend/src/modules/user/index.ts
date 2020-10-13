import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { CategoryModule } from '../category';
import { RelayModule } from '../relay';

import { UserProvider } from './user.provider';

export interface UserModuleContext {}

export type UserModuleResolversType = GQLResolvers<ModuleContext<UserModuleContext>>;

export const UserModule = new GraphQLModule<any, ApolloContext, UserModuleContext>({
	imports: [CategoryModule, RelayModule],
	providers: [UserProvider],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
