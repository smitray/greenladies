import React from 'react';

import { NextComponentType } from 'next';
import { AppContextType, AppInitialProps, AppPropsType } from 'next/dist/next-server/lib/utils';
import { Record } from 'relay-runtime/lib/store/RelayStoreTypes';
import { createGlobalStyle } from 'styled-components';

import { MessageBar } from '../components/MessageBar';
import { Navbar } from '../components/Navbar';
import { createRelayEnvironment, initRelayEnvironment } from '../lib/relay-environment';

type ServerState = { [key: string]: Record };

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
	createRelayEnvironment(serverState);

	return (
		<React.Fragment>
			<GlobalStyles />
			<MessageBar />
			<Navbar />
			<Component {...pageProps} />
		</React.Fragment>
	);
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
	const relayEnvironment = initRelayEnvironment();

	const pageProps = await (Component as any).getInitialProps({ ...ctx, relayEnvironment });

	const serverState = relayEnvironment.getStore().getSource().toJSON();

	return { pageProps, serverState };
};

export default MyApp;
