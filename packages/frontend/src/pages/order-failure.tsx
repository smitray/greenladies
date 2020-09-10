import React from 'react';

import Head from 'next/head';

import { MyNextPage } from '../lib/types';
import { CenterWrapper } from '../styles/center-wrapper';

const OrderFailure: MyNextPage = () => {
	return (
		<React.Fragment>
			<Head>
				<title>Orderproblem | greenladies.se</title>
				<meta name="robots" content="noindex,nofollow" />
			</Head>
			<CenterWrapper>
				<div style={{ textAlign: 'center', padding: '2em', color: 'grey' }}>Något gick fel med din order</div>
			</CenterWrapper>
		</React.Fragment>
	);
};

export default OrderFailure;
