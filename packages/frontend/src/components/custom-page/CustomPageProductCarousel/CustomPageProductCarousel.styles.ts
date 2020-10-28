import styled from 'styled-components';

import { CenterWrapper } from '../../../styles/center-wrapper';
import { IconWrapper } from '../../../styles/icon-wrapper';

export const ProductCarouselComponentWrapper = styled.div`
	padding-top: 48px;
	padding-bottom: 64px;
`;

export const ProductCarouselTitleWrapper = styled(CenterWrapper)`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	flex-direction: column;
	margin-bottom: 32px;

	@media (min-width: 641px) {
		flex-direction: row;
		align-items: flex-end;
	}
`;

export const ProductCarouselTitle = styled.a`
	display: block;
	font-size: 32px;
	font-weight: bold;
	color: black;
	text-decoration: none;
`;

export const ProductCarouselSubtitle = styled.a`
	font-family: Arimo, sans-serif;
	font-size: 28px;
	color: black;
	text-decoration: none;
`;

export const ProductCarouselShopLink = styled.a`
	display: flex;
	align-items: center;
	color: black;
	text-decoration: none;
	font-size: 20px;
	margin-top: 24px;
`;

export const ProductCarouselShopIconWrapper = styled(IconWrapper)`
	margin-left: 4px;
`;
