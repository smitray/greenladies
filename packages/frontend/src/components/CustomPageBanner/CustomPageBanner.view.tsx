import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { Link } from '../Link';

import { CustomPageBanner_banner } from './__generated__/CustomPageBanner_banner.graphql';

interface CustomPageBannerViewProps {
	banner: CustomPageBanner_banner;
}

const CustomPageBannerView = ({ banner }: CustomPageBannerViewProps) => {
	return (
		<div style={{ position: 'relative' }}>
			<img src={banner.imagePath} alt="" style={{ width: '100%', display: 'block' }} />
			<div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', zIndex: 1 }}>
				<Link link={banner.link}>
					<a style={{ textDecoration: 'none' }}>
						<div
							style={{
								padding: '16px 48px',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-end',
							}}
						>
							<div style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', marginBottom: '48px' }}>
								{banner.title}
							</div>
							<div>
								<span
									style={{
										color: 'white',
										fontSize: '12px',
										fontWeight: 'bold',
										paddingBottom: '2px',
										borderBottom: '2px solid white',
									}}
								>
									{banner.subtitle}
								</span>
							</div>
						</div>
					</a>
				</Link>
			</div>
		</div>
	);
};

export default createFragmentContainer(CustomPageBannerView, {
	banner: graphql`
		fragment CustomPageBanner_banner on CustomPageBanner {
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
