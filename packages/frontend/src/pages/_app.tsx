import 'rc-slider/assets/index.css';
import 'rc-drawer/assets/index.css';
import 'react-photoswipe/lib/photoswipe.css';

import React from 'react';

import { NextComponentType } from 'next';
import { AppContextType, AppInitialProps, AppPropsType, NextPageContext } from 'next/dist/next-server/lib/utils';
import { fetchQuery } from 'react-relay';
import { RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay/hooks';
import { Record as RelayRecord } from 'relay-runtime/lib/store/RelayStoreTypes';
import { createGlobalStyle } from 'styled-components';

import { MessageBar } from '../components/MessageBar';
import { Navbar } from '../components/Navbar';
import { ShoppingCartProvider } from '../contexts/shopping-cart-context';
import { WishlistProvider } from '../contexts/wishlist-context';
import { createRelayEnvironment } from '../lib/relay-environment';
import { APP_QUERY, AppQuery } from '../queries/app';

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

  .ReactCollapse--collapse {
    transition: height 300ms ease-in-out;
  }
`;

const MyApp: MyAppType = ({ Component, pageProps, serverState }) => {
	const environment = createRelayEnvironment(serverState);

	return (
		<RelayEnvironmentProvider environment={environment}>
			<MyAppInner Component={Component} pageProps={pageProps} />
		</RelayEnvironmentProvider>
	);
};

interface MyAppInnerProps {
	Component: NextComponentType<NextPageContext, any, any>;
	pageProps: any;
}

const MyAppInner = ({ Component, pageProps }: MyAppInnerProps) => {
	const { wishlist, shoppingCart } = useLazyLoadQuery<AppQuery>(APP_QUERY, { fetchPolicy: 'store-only' });

	return (
		<WishlistProvider wishlist={wishlist}>
			<ShoppingCartProvider cart={shoppingCart}>
				<React.Fragment>
					<GlobalStyles />
					<MessageBar />
					<Navbar />
					<Component {...pageProps} />
				</React.Fragment>
			</ShoppingCartProvider>
		</WishlistProvider>
	);
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
	const relayEnvironment = createRelayEnvironment(undefined, ctx.req?.headers.cookie);

	const appQueryPromise = fetchQuery<AppQuery>(relayEnvironment, APP_QUERY, {});

	let pageProps: Record<string, any> = {};
	if ((Component as any).getInitialProps) {
		pageProps = await (Component as any).getInitialProps({ ...ctx, relayEnvironment });
	}

	await appQueryPromise;

	const serverState = relayEnvironment.getStore().getSource().toJSON();

	return { pageProps, serverState };
};

export default MyApp;
