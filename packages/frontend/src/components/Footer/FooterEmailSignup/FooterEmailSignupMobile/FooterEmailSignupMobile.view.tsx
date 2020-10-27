import React from 'react';

import { FooterEmailSignupCard } from '../FooterEmailSignupCard';

import { MobileSignupCenterWrapper, MobileSignupWrapper } from './FooterEmailSignupMobile.styles';

export const FooterEmailSignupMobileView = () => {
	return (
		<MobileSignupWrapper>
			<MobileSignupCenterWrapper>
				<FooterEmailSignupCard />
			</MobileSignupCenterWrapper>
		</MobileSignupWrapper>
	);
};
