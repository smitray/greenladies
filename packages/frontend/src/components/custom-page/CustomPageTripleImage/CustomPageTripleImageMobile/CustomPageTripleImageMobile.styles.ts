import styled from 'styled-components';

interface TripleImageMobileWrapperProps {
	background: string;
}

export const TripleImageMobileWrapper = styled.div<TripleImageMobileWrapperProps>`
	padding: 16px 28px;
	background: ${({ background }) => background};
`;

export const TripleImageMobileImageWrapper = styled.a`
	position: relative;
	display: block;
	color: black;
`;

export const TripleImageMobileImage = styled.img`
	display: block;
	width: 100%;
`;

interface TripleImageMobileImageOverlayProps {
	background: string;
}

export const TripleImageMobileImageOverlay = styled.div<TripleImageMobileImageOverlayProps>`
	position: absolute;
	bottom: 12px;
	left: -1px;
	width: 80%;
	padding: 12px;
	background: ${({ background }) => background};
`;

export const TripleImageMobileSmallTitle = styled.div`
	font-size: 18px;
`;

export const TripleImageMobileBigTitle = styled.div`
	font-family: Arimo, sans-serif;
	font-size: 32px;
	font-weight: bold;
`;
export const TripleImageMobileShop = styled.div`
	display: inline-block;
	font-size: 16px;
	font-weight: bold;
	margin-top: 12px;
	padding-bottom: 2px;
	border-bottom: 2px solid black;
`;
