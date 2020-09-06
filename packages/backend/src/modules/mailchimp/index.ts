import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import { loadFiles } from '@graphql-toolkit/file-loading';
import path from 'path';

import { GQLResolvers } from '../../__generated__/types';
import { ApolloContext } from '../../create-apollo-server';

export interface MailchimpModuleContext {}

export type MailchimpModuleResolversType = GQLResolvers<ModuleContext<MailchimpModuleContext>>;

export const MailchimpModule = new GraphQLModule<any, ApolloContext, MailchimpModuleContext>({
	imports: [],
	providers: [],
	typeDefs: loadFiles(path.join(__dirname, 'schema', '*.{gql,ts,js}')),
	resolvers: loadFiles<any>(path.join(__dirname, 'resolvers', '**/*.{ts,js}')),
});
