import React from 'react';

import styled from 'styled-components';

import { MyNextPage } from '../lib/types';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	background: lightgrey;
	padding: 24px;
	display: flex;
	align-items: flex-start;
`;

const OrderFailure: MyNextPage = () => {
	return (
		<CenterWrapper>
			<div>Något gick fel med din order</div>
		</CenterWrapper>
	);
};

export default OrderFailure;
