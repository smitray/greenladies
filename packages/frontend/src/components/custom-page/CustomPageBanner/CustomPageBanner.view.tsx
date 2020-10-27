import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { HideOnMinSize, ShowOnMinSize } from '../../../styles/responsive';

import { CustomPageBanner_banner } from './__generated__/CustomPageBanner_banner.graphql';
import { CustomPageBannerDesktop } from './CustomPageBannerDesktop';
import { CustomPageBannerMobile } from './CustomPageBannerMobile';

interface CustomPageBannerViewProps {
	banner: CustomPageBanner_banner;
}

const CustomPageBannerView = ({ banner }: CustomPageBannerViewProps) => {
	return (
		<React.Fragment>
			<HideOnMinSize size="m">
				<CustomPageBannerMobile banner={banner} />
			</HideOnMinSize>
			<ShowOnMinSize size="m">
				<CustomPageBannerDesktop banner={banner} />
			</ShowOnMinSize>
		</React.Fragment>
	);
};

export default createFragmentContainer(CustomPageBannerView, {
	banner: graphql`
		fragment CustomPageBanner_banner on CustomPageBanner {
			...CustomPageBannerMobile_banner
			...CustomPageBannerDesktop_banner
		}
	`,
});
