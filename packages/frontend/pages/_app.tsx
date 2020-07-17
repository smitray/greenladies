import React, { useMemo } from 'react';

import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { NextPage } from 'next';
import App, { AppProps } from 'next/app';
import Head from 'next/head';

import { initializeApollo } from '../lib/apollo-client';

const MyApp: NextPage<AppProps> = ({ Component, pageProps, serverState }) => {
	const apolloClient = useMemo(() => initializeApollo(serverState), [serverState]);
	return (
		<ApolloProvider client={apolloClient}>
			<Component {...pageProps} />
		</ApolloProvider>
	);
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
	let pageProps = {};
	let serverState = {};

	const apolloClient = initializeApollo({});

	if (Component.getInitialProps) {
		pageProps = await Component.getInitialProps({ ...ctx, apolloClient });
	}

	serverState = apolloClient.cache.extract();

	return { serverState, pageProps };
};

export default MyApp;
