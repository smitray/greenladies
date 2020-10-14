import 'antd/dist/antd.css';

import React from 'react';

import { NextComponentType } from 'next';
import { AppContextType, AppInitialProps, AppPropsType } from 'next/dist/next-server/lib/utils';
import { fetchQuery, QueryRenderer } from 'react-relay';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { Record as RelayRecord } from 'relay-runtime/lib/store/RelayStoreTypes';

import { AuthProvider } from '../contexts/auth-context';
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

const MyApp: MyAppType = ({ Component, pageProps }) => {
	const environment = createRelayEnvironment();

	return (
		<RelayEnvironmentProvider environment={environment}>
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
								<AuthProvider viewer={props.viewer}>
									<Component {...pageProps} />
								</AuthProvider>
							</React.Fragment>
						);
					}

					return <div>Loading...</div>;
				}}
			/>
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
