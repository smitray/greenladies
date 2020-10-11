import styled from 'styled-components';

export const FooterInfoMobileItemContainer = styled.ul`
	padding: 0;
	margin: 0;
	list-style: none;
`;

export const FooterInfoMobileItem = styled.li`
	&:not(:last-child) {
		border-bottom: 1px solid #ddd;
	}
`;

export const FooterInfoMobileItemHeader = styled.div`
	font-weight: bold;
	font-size: 14px;
	padding: 20px 16px;
	display: flex;
	justify-content: space-between;
	cursor: pointer;
`;
