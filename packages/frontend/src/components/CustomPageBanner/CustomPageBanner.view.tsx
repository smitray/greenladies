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
				<Link link={banner.link}>
					<a style={{ display: 'block', position: 'relative', color: 'inherit', textDecoration: 'none' }}>
						<img src={banner.mobileImagePath} alt="" style={{ width: '100%' }} />
						<div
							style={{
								position: 'absolute',
								top: '0',
								right: '0',
								bottom: '0',
								left: '0',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'flex-end',
								padding: '24px',
							}}
						>
							<div style={{ background: 'white', padding: '12px 24px' }}>
								<div style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>{banner.title}</div>
								<div
									style={{
										fontSize: '18px',
										paddingBottom: '0px',
										borderBottom: '2px solid black',
										display: 'inline-block',
									}}
								>
									Shoppa
								</div>
							</div>
						</div>
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
										alignItems: 'flex-start',
									}}
								>
									<div style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', marginBottom: '36px' }}>
										{banner.title}
									</div>
									<div
										style={{
											color: 'white',
											fontSize: '20px',
											fontWeight: 'bold',
											paddingBottom: '8px',
											borderBottom: '2px solid white',
										}}
									>
										Shoppa
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
