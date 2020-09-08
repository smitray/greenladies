import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { CenterWrapper } from '../../styles/center-wrapper';
import { Link } from '../Link';

import { CustomPageBanner_banner } from './__generated__/CustomPageBanner_banner.graphql';

interface CustomPageBannerViewProps {
	banner: CustomPageBanner_banner;
}

const MobileWrapper = styled.div`
	display: block;

	@media (min-width: 641px) {
		display: none;
	}
`;

const NotMobileWrapper = styled.div`
	display: none;
	position: relative;

	@media (min-width: 641px) {
		display: block;
	}
`;

const CustomPageBannerView = ({ banner }: CustomPageBannerViewProps) => {
	return (
		<React.Fragment>
			<MobileWrapper>
				<CenterWrapper>
					<Link link={banner.link}>
						<a
							style={{
								fontSize: '2em',
								margin: '0.5em 0',
								fontWeight: 'bold',
								color: 'black',
								textDecoration: 'none',
								display: 'block',
							}}
						>
							{banner.title}
						</a>
					</Link>
					<Link link={banner.link}>
						<a
							style={{
								marginBottom: '1em',
								fontSize: '0.8em',
								color: 'black',
								display: 'block',
								textDecoration: 'none',
							}}
						>
							{banner.subtitle}
						</a>
					</Link>
				</CenterWrapper>
				<Link link={banner.link}>
					<a>
						<img src={banner.mobileImagePath} alt="" style={{ width: '100%' }} />
					</a>
				</Link>
			</MobileWrapper>
			<NotMobileWrapper>
				<img src={banner.imagePath} alt="" style={{ width: '100%', display: 'block' }} />
				<Link link={banner.link}>
					<a
						style={{
							textDecoration: 'none',
							position: 'absolute',
							top: '0',
							right: '0',
							bottom: '0',
							left: '0',
							zIndex: 1,
							display: 'flex',
							justifyContent: 'flex-start',
							alignItems: 'flex-end',
						}}
					>
						<div style={{ padding: '24px 0', flexGrow: 1 }}>
							<CenterWrapper>
								<div
									style={{
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
							</CenterWrapper>
						</div>
					</a>
				</Link>
			</NotMobileWrapper>
		</React.Fragment>
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
