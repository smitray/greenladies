import 'rc-slider/assets/index.css';
import 'rc-drawer/assets/index.css';
import 'react-photoswipe/lib/photoswipe.css';

import React from 'react';

import { AppType } from 'next/dist/next-server/lib/utils';
import { QueryRenderer } from 'react-relay';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createGlobalStyle } from 'styled-components';

import { createRelayEnvironment } from '../lib/relay-environment';
import { APP_QUERY, AppQuery } from '../queries/app';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
  }
`;

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
								<GlobalStyles />
								<Component {...pageProps} />
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
