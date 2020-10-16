import styled from 'styled-components';

export const MegaMenuOuterList = styled.ul`
	display: flex;
	margin: 0;
	padding: 0;
`;

export const MegaMenuOuterListItem = styled.li`
	display: flex;
	flex-direction: column;
`;

export const MegaMenuTitle = styled.h2`
	margin-top: 0;
	margin-bottom: 16px;
`;

export const MegaMenuChunkList = styled.ul`
	display: flex;
	list-style: none;
	padding: 0;
`;

export const MegaMenuChunkListItem = styled.li`
	flex-grow: 1;
`;

export const MegaMenuInnerList = styled.ul`
	display: flex;
	flex-direction: column;
	padding-left: 0;
	padding-right: 16px;
	list-style: none;
`;

export const MegaMenuInnerListItem = styled.li`
	padding: 8px 0;
`;

export const MegaMenuLink = styled.a`
	color: black;
	text-decoration: none;
	font-size: 15px;
	font-weight: bold;
`;
