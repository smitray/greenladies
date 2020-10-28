import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { CenterWrapper } from '../../../../styles/center-wrapper';
import { Link } from '../../../Link';

import { CustomPageBannerDesktop_banner } from './__generated__/CustomPageBannerDesktop_banner.graphql';
import {
	BannerDesktopImage,
	BannerDesktopImageOverlay,
	BannerDesktopShopMore,
	BannerDesktopTextWrapper,
	BannerDesktopTitle,
	BannerDesktopWrapperLink,
} from './CustomPageBannerDesktop.styles';

interface CustomPageBannerDesktopViewProps {
	banner: CustomPageBannerDesktop_banner;
}

const CustomPageBannerDesktopView = ({ banner }: CustomPageBannerDesktopViewProps) => {
	return (
		<Link link={banner.link}>
			<BannerDesktopWrapperLink>
				<BannerDesktopImage src={banner.imagePath} />
				<BannerDesktopImageOverlay>
					<BannerDesktopTextWrapper>
						<CenterWrapper>
							<BannerDesktopTitle>{banner.title}</BannerDesktopTitle>
							<BannerDesktopShopMore>Shoppa</BannerDesktopShopMore>
						</CenterWrapper>
					</BannerDesktopTextWrapper>
				</BannerDesktopImageOverlay>
			</BannerDesktopWrapperLink>
		</Link>
	);
};

export default createFragmentContainer(CustomPageBannerDesktopView, {
	banner: graphql`
		fragment CustomPageBannerDesktop_banner on CustomPageBanner {
			title
			link {
				...Link_link
			}
			imagePath
		}
	`,
});
