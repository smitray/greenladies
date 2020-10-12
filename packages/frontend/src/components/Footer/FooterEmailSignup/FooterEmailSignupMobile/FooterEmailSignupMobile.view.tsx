import React from 'react';

import styled from 'styled-components';

import { CenterWrapper } from '../../../../styles/center-wrapper';
import { FooterEmailSignupCard } from '../FooterEmailSignupCard';

export const MobileSignupWrapper = styled.div`
	background: url(/images/email-signup-1.jpg);
	background-size: cover;
	background-position: center;
	padding: 32px 24px;
`;

export const MobileSignupCenterWrapper = styled(CenterWrapper)`
	display: flex;
	justify-content: center;
`;

export const FooterEmailSignupMobileView = () => {
	return (
		<MobileSignupWrapper>
			<MobileSignupCenterWrapper>
				<FooterEmailSignupCard />
			</MobileSignupCenterWrapper>
		</MobileSignupWrapper>
	);
};
