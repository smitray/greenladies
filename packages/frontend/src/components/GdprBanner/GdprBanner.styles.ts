import styled from 'styled-components';

interface GdprBannerWrapperProps {
	open: boolean;
}

export const GdprBannerWrapper = styled.div<GdprBannerWrapperProps>`
	position: fixed;
	display: ${({ open }) => (open ? 'flex' : 'none')};
	background: black;
	bottom: 0;
	width: 100%;
	padding: 12px;
	color: white;
	justify-content: center;
	align-items: center;
`;

export const GdprBannerInfoText = styled.div`
	text-align: center;
`;

export const GdprBannerLink = styled.a`
	color: white;
`;

export const GdprAcceptButton = styled.button`
	margin-left: 16px;
	padding: 8px 16px;
	font-size: 16px;
	color: white;
	background: none;
	outline: none;
	cursor: pointer;
	border: 1px solid white;
	white-space: nowrap;
`;
