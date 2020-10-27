import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { Link } from '../../../Link';

import { CustomPageBannerMobile_banner } from './__generated__/CustomPageBannerMobile_banner.graphql';
import {
	BannerMobileImage,
	BannerMobileImageOverlay,
	BannerMobileShopMore,
	BannerMobileTextWrapper,
	BannerMobileTitle,
	BannerMobileWrapperLink,
} from './CustomPageBannerMobile.styles';

interface CustomPageBannerMobileViewProps {
	banner: CustomPageBannerMobile_banner;
}

const CustomPageBannerMobileView = ({ banner }: CustomPageBannerMobileViewProps) => {
	return (
		<Link link={banner.link}>
			<BannerMobileWrapperLink>
				<BannerMobileImage src={banner.mobileImagePath} />
				<BannerMobileImageOverlay>
					<BannerMobileTextWrapper>
						<BannerMobileTitle>{banner.title}</BannerMobileTitle>
						<BannerMobileShopMore>Shoppa</BannerMobileShopMore>
					</BannerMobileTextWrapper>
				</BannerMobileImageOverlay>
			</BannerMobileWrapperLink>
		</Link>
	);
};

export default createFragmentContainer(CustomPageBannerMobileView, {
	banner: graphql`
		fragment CustomPageBannerMobile_banner on CustomPageBanner {
			title
			subtitle
			link {
				...Link_link
			}
			imagePath
			mobileImagePath
		}
	`,
});
