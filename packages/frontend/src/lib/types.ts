import { NextComponentType, NextPageContext } from 'next';
import { Environment } from 'relay-runtime';

interface MyNextPageContext extends NextPageContext {
	relayEnvironment: Environment;
}

export type MyNextPage<P = any, IP = P> = NextComponentType<MyNextPageContext, IP, P>;
