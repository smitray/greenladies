import styled from 'styled-components';

import { CenterWrapper } from '../../../../styles/center-wrapper';

interface TripleImageDesktopWrapperProps {
	background: string;
}

export const TripleImageDesktopWrapper = styled.div<TripleImageDesktopWrapperProps>`
	padding: 72px 0;
	background: ${({ background }) => background};
`;

export const TripleImageDesktopItemsContainer = styled(CenterWrapper)`
	display: flex;
`;

export const TripleImageDesktopImage = styled.img`
	width: 100%;
`;

export const TripleImageDesktopSmallTitle = styled.div`
	font-size: 32px;
	font-weight: bold;
`;

export const TripleImageDesktopBigTitle = styled.div`
	font-size: 52px;
	font-weight: bold;
`;
export const TripleImageDesktopShop = styled.a`
	font-size: 20px;
	font-weight: bold;
	padding-bottom: 4px;
	border-bottom: 2px solid black;
	color: black;
	text-decoration: none;
`;

interface TripleImageDesktopItemProps {
	widthPercentage: number;
}

export const TripleImageDesktopItem = styled.div<TripleImageDesktopItemProps>`
	flex-basis: ${({ widthPercentage }) => widthPercentage}%;
	width: ${({ widthPercentage }) => widthPercentage}%;

	&:not(:first-child) {
		margin-left: 12px;
	}

	&:not(:last-child) {
		margin-right: 12px;
	}
`;

export const TripleImageDesktopTextItem = styled(TripleImageDesktopItem)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	margin-top: 6%;
`;
