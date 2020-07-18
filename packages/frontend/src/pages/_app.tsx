import React, { useMemo } from 'react';

import { ApolloProvider } from '@apollo/client';
import { NextComponentType } from 'next';
import { AppContextType, AppInitialProps, AppPropsType } from 'next/dist/next-server/lib/utils';
import { createGlobalStyle } from 'styled-components';

import { MessageBar } from '../components/MessageBar';
import { initializeApollo } from '../lib/apollo-client';

interface MyAppInitialProps extends AppInitialProps {
	serverState: any;
}

interface MyAppPropsType extends AppPropsType {
	serverState: any;
}

export declare type MyAppType = NextComponentType<AppContextType, MyAppInitialProps, MyAppPropsType>;

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
  }
`;

const MyApp: MyAppType = ({ Component, pageProps, serverState }) => {
	const apolloClient = useMemo(() => initializeApollo(serverState), [serverState]);

	return (
		<ApolloProvider client={apolloClient}>
			<React.Fragment>
				<GlobalStyles />
				<MessageBar />
				<Component {...pageProps} />
			</React.Fragment>
		</ApolloProvider>
	);
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
	const apolloClient = initializeApollo({});

	const pageProps = await (Component as any).getInitialProps({ ...ctx, apolloClient });

	const serverState = apolloClient.cache.extract();

	return { pageProps, serverState };
};

export default MyApp;
