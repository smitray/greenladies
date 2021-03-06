import 'rc-slider/assets/index.css';
import 'rc-drawer/assets/index.css';
import 'react-photoswipe/lib/photoswipe.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import React from 'react';

import { NextComponentType } from 'next';
import { AppContextType, AppInitialProps, AppPropsType } from 'next/dist/next-server/lib/utils';
import { fetchQuery, QueryRenderer } from 'react-relay';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { Record as RelayRecord } from 'relay-runtime/lib/store/RelayStoreTypes';
import { createGlobalStyle } from 'styled-components';

import { Footer } from '../components/Footer';
import { GdprBanner } from '../components/GdprBanner';
import { MessageBar } from '../components/MessageBar';
import { Navbar } from '../components/Navbar';
import { ShoppingCartModalProvider } from '../contexts/shopping-cart-model-context';
import { usePixelPageview } from '../hooks/use-pixel-pageview';
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
    font-family: Arial, sans-serif;
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
	usePixelPageview();
	const environment = createRelayEnvironment(serverState);

	return (
		<RelayEnvironmentProvider environment={environment}>
			<ShoppingCartModalProvider>
				<QueryRenderer<AppQuery>
					environment={environment}
					fetchPolicy="store-and-network"
					query={APP_QUERY}
					variables={{}}
					render={({ error, props }) => {
						if (error) {
							return <div>Error</div>;
						}

						if (props) {
							return (
								<React.Fragment>
									<GlobalStyles />
									<MessageBar />
									<Navbar megamenu={props.megamenu} query={props} />
									<Component {...pageProps} />
									<Footer query={props} />
									<GdprBanner />
								</React.Fragment>
							);
						}

						return <div>Loading...</div>;
					}}
				/>
			</ShoppingCartModalProvider>
		</RelayEnvironmentProvider>
	);
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
	const relayEnvironment = createRelayEnvironment(undefined, ctx.req?.headers.cookie);

	const appQuery = fetchQuery<AppQuery>(relayEnvironment, APP_QUERY, {});

	let pageProps: Record<string, any> = {};
	if ((Component as any).getInitialProps) {
		pageProps = await (Component as any).getInitialProps({ ...ctx, relayEnvironment });
	}

	await appQuery;

	const serverState = relayEnvironment.getStore().getSource().toJSON();

	return { pageProps, serverState };
};

export default MyApp;
