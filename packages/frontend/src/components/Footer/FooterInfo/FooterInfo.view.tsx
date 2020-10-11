import React from 'react';

import { HideOnMinSize, ShowOnMinSize } from '../../../styles/responsive';

import { FooterInfoDesktop } from './FooterInfoDesktop';
import { FooterInfoMobile } from './FooterInfoMobile';

export const FooterInfoView = () => {
	return (
		<React.Fragment>
			<HideOnMinSize size="l">
				<FooterInfoMobile />
			</HideOnMinSize>
			<ShowOnMinSize size="l">
				<FooterInfoDesktop />
			</ShowOnMinSize>
		</React.Fragment>
	);
};
