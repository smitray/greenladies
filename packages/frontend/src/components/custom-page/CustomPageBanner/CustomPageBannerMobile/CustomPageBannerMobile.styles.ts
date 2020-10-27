import styled from 'styled-components';

export const BannerMobileWrapperLink = styled.a`
	position: relative;
	display: block;
`;

export const BannerMobileImage = styled.img`
	display: block;
	width: 100%;
`;

export const BannerMobileImageOverlay = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	padding: 24px;
`;

export const BannerMobileTextWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 12px 24px;
	background: white;
`;

export const BannerMobileTitle = styled.div`
	color: black;
	font-family: Arimo, sans-serif;
	font-size: 28px;
	font-weight: bold;
	margin-bottom: 8px;
`;

export const BannerMobileShopMore = styled.div`
	color: black;
	font-size: 18px;
	border-bottom: 2px solid black;
`;
