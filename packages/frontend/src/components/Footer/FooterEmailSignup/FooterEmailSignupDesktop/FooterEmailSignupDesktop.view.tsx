import React from 'react';

import { FooterEmailSignupCard } from '../FooterEmailSignupCard';

import {
	DesktopSignupCenterWrapper,
	DesktopSignupImage,
	DesktopSignupWrapper,
} from './FooterEmailSignupDesktop.styles';

export const FooterEmailSignupDesktopView = () => {
	return (
		<DesktopSignupWrapper>
			<DesktopSignupCenterWrapper>
				<FooterEmailSignupCard />
				<DesktopSignupImage />
			</DesktopSignupCenterWrapper>
		</DesktopSignupWrapper>
	);
};
