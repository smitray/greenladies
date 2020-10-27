import React from 'react';

import { HideOnMinSize, ShowOnMinSize } from '../../../styles/responsive';

import { FooterEmailSignupDesktop } from './FooterEmailSignupDesktop';
import { FooterEmailSignupMobile } from './FooterEmailSignupMobile';

export const FooterEmailSignupView = () => {
	return (
		<React.Fragment>
			<HideOnMinSize size="l">
				<FooterEmailSignupMobile />
			</HideOnMinSize>
			<ShowOnMinSize size="l">
				<FooterEmailSignupDesktop />
			</ShowOnMinSize>
		</React.Fragment>
	);
};
