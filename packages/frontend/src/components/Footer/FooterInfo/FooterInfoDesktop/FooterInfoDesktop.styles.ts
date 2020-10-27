import styled from 'styled-components';

export const FooterInfoDesktopWrapper = styled.div`
	background: #eceaeb;
`;

export const FooterInfoDesktopSectionsContainer = styled.ul`
	margin: 0;
	padding: 32px 0 0 0;
	display: flex;
	list-style: none;
`;

export const FooterInfoDesktopSection = styled.li`
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

export const FooterInfoDesktopSectionHeader = styled.div`
	text-transform: uppercase;
	font-weight: bold;
	font-size: 12px;
	margin-bottom: 24px;
	color: #3a3a3a;
`;
