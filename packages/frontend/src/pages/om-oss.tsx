import React from 'react';

import styled from 'styled-components';

import { MyNextPage } from '../lib/types';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	padding: 0 40px;
	display: flex;
	align-items: flex-start;
`;

const AboutUs: MyNextPage = () => {
	return (
		<CenterWrapper>
			<div>Om oss</div>
		</CenterWrapper>
	);
};

export default AboutUs;
