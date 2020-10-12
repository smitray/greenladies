import styled from 'styled-components';

export const FooterInfoDesktopItemContainer = styled.ul`
	margin: 0;
	padding: 32px 0 0 0;
	display: flex;
	list-style: none;
`;

export const FooterInfoDesktopItem = styled.li`
	margin-right: 16px;
	margin-left: 16px;
	margin-bottom: 16px;
	width: 100%;

	&:first-child {
		margin-left: 0;
	}

	&:last-child {
		margin-right: 0;
	}
`;

export const FooterInfoDesktopItemHeader = styled.div`
	text-transform: uppercase;
	font-weight: bold;
	font-size: 12px;
	margin-bottom: 24px;
	color: #3a3a3a;
`;

export const FooterInfoIconImageWrapper = styled.div`
	width: 24px;
	height: 28px;
	display: flex;
	align-items: center;
`;

export const FooterInfoIconImage = styled.img`
	width: 100%;
`;

export const FooterInfoIconImageText = styled.span`
	margin-left: 8px;
`;
