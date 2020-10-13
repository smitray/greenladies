import 'antd/dist/antd.css';

import React from 'react';

import { AppType } from 'next/dist/next-server/lib/utils';
import { QueryRenderer } from 'react-relay';
import { RelayEnvironmentProvider } from 'react-relay/hooks';

import { AuthProvider } from '../contexts/auth-context';
import { createRelayEnvironment } from '../lib/relay-environment';
import { APP_QUERY, AppQuery } from '../queries/app';

const MyApp: AppType = ({ Component, pageProps }) => {
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

export default MyApp;
