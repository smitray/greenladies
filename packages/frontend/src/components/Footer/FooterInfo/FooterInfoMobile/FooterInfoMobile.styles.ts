import styled from 'styled-components';

export const FooterInfoMobileWrapper = styled.div`
	background: #eceaeb;
`;

export const FooterInfoMobileSectionsContainer = styled.ul`
	padding: 0;
	margin: 0;
	list-style: none;
`;

export const FooterInfoMobileSection = styled.li`
	&:not(:last-child) {
		border-bottom: 1px solid #ddd;
	}
`;

export const FooterInfoMobileSectionHeader = styled.div`
	font-weight: bold;
	font-size: 14px;
	padding: 20px 16px;
	display: flex;
	justify-content: space-between;
	cursor: pointer;
`;

export const FooterInfoMobileSectionContentWrapper = styled.div`
	padding: 0 16px 16px;
`;
