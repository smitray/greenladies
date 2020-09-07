import React from 'react';

import { MyNextPage } from '../lib/types';
import { CenterWrapper } from '../styles/center-wrapper';

const OrderFailure: MyNextPage = () => {
	return (
		<CenterWrapper>
			<div style={{ textAlign: 'center' }}>Något gick fel med din order</div>
		</CenterWrapper>
	);
};

export default OrderFailure;
