import React from 'react';

import styled from 'styled-components';

import { MyNextPage } from '../lib/types';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 24px 40px;
	margin: 0 auto;
	padding: 24px;
`;

const OrderFailure: MyNextPage = () => {
	return (
		<CenterWrapper>
			<div style={{ textAlign: 'center' }}>Något gick fel med din order</div>
		</CenterWrapper>
	);
};

export default OrderFailure;
