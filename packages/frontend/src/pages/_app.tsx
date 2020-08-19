import 'rc-slider/assets/index.css';

import React from 'react';

import { NextComponentType } from 'next';
import { AppContextType, AppInitialProps, AppPropsType } from 'next/dist/next-server/lib/utils';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { Record as RelayRecord } from 'relay-runtime/lib/store/RelayStoreTypes';
import { createGlobalStyle } from 'styled-components';

import { MessageBar } from '../components/MessageBar';
import { Navbar } from '../components/Navbar';
import { createRelayEnvironment } from '../lib/relay-environment';

type ServerState = { [key: string]: RelayRecord };

interface MyAppInitialProps extends AppInitialProps {
	serverState: ServerState;
}

interface MyAppPropsType extends AppPropsType {
	serverState: ServerState;
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
	const environment = createRelayEnvironment(serverState);

	return (
		<RelayEnvironmentProvider environment={environment}>
			<React.Fragment>
				<GlobalStyles />
				<MessageBar />
				<Navbar />
				<Component {...pageProps} />
			</React.Fragment>
		</RelayEnvironmentProvider>
	);
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
	const relayEnvironment = createRelayEnvironment(undefined, ctx.req?.headers.cookie);

	let pageProps: Record<string, any> = {};
	if ((Component as any).getInitialProps) {
		pageProps = await (Component as any).getInitialProps({ ...ctx, relayEnvironment });
	}

	const serverState = relayEnvironment.getStore().getSource().toJSON();

	return { pageProps, serverState };
};

export default MyApp;
