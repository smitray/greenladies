import styled from 'styled-components';

export const BannerDesktopWrapperLink = styled.a`
	position: relative;
	display: block;
`;

export const BannerDesktopImage = styled.img`
	display: block;
	width: 100%;
`;

export const BannerDesktopImageOverlay = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1;
	display: flex;
	justify-content: flex-start;
	align-items: flex-end;
`;

export const BannerDesktopTextWrapper = styled.div`
	padding: 24px 0;
	flex-grow: 1;
`;

export const BannerDesktopTitle = styled.div`
	color: white;
	font-size: 42px;
	font-weight: bold;
	margin-bottom: 32px;
`;

export const BannerDesktopShopMore = styled.span`
	display: inline-block;
	color: white;
	font-size: 20px;
	font-weight: bold;
	padding-bottom: 8px;
	border-bottom: 2px solid white;
`;
