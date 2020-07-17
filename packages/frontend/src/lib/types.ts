import { ApolloClient } from '@apollo/client';
import { NextComponentType, NextPageContext } from 'next';

interface MyNextPageContext extends NextPageContext {
	apolloClient: ApolloClient<any>;
}

export type MyNextPage<P = any, IP = P> = NextComponentType<MyNextPageContext, IP, P>;
