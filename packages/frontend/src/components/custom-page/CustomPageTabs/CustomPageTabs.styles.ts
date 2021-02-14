import styled, { css } from 'styled-components';

import { CenterWrapper } from '../../../styles/center-wrapper';

export const TabComponentWrapper = styled(CenterWrapper)`
	padding-top: 24px;
	padding-bottom: 24px;
`;

interface SidebarLinkProps {
	active: boolean;
}

export const TabTitle = styled.h1`
	text-align: center;
`;

export const TabLinksAndContentWrapper = styled.div`
	display: flex;
	flex-direction: column;

	@media (min-width: 961px) {
		align-items: start;
		flex-direction: row;
	}
`;

export const TabLinksContainer = styled.div`
	display: block;
	flex-shrink: 0;
	border-right: 1px solid black;
	margin-right: 32px;
`;

export const TabContentWrapper = styled.div`
	flex-grow: 1;
	font-size: 16px;
	line-height: 24px;
`;

export const TabLink = styled.a<SidebarLinkProps>`
	&:hover {
		text-decoration: underline;
	}

	white-space: nowrap;
	display: block;
	color: black;
	text-decoration: none;
	cursor: pointer;
	position: relative;
	padding: 8px 16px;
	font-size: 16px;
	font-weight: ${({ active }) => (active ? 'bold' : 'normal')};

	text-align: right;
	padding: 8px 16px 8px 0;

	${({ active }) =>
		active
			? css`
					&:after {
						content: '';
						height: 100%;
						width: 3px;
						background: #000;
						position: absolute;
						right: 0;
						top: 0;
						left: unset;
					}
			  `
			: ''}
`;
