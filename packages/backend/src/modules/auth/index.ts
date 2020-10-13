import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import { Request } from 'express';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';
import { UserModule } from '../user';

export interface AuthModuleContext {
	request: Request;
}

export type AuthModuleResolversType = GQLResolvers<ModuleContext<AuthModuleContext>>;

export const AuthModule = new GraphQLModule<any, ApolloContext, AuthModuleContext>({
	imports: [UserModule],
	providers: [],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
	context: ({ req }) => {
		return {
			request: req,
		};
	},
});
