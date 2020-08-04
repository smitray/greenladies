import styled from 'styled-components';

interface FilterBoxWrapperProps {
	open: boolean;
}

export const FilterBoxWrapper = styled.li<FilterBoxWrapperProps>`
	position: relative;
	margin-right: 4px;
	border: 1px solid ${({ open }) => (open ? '#eaeaea' : 'white')};
	background: ${({ open }) => (open ? '#eaeaea' : 'white')};
	z-index: 20;

	&:hover {
		border: 1px solid #eaeaea;
	}
`;

export const FilterBoxTitle = styled.a`
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	padding: 8px 24px 8px 8px;
	max-width: 180px;
	text-decoration: none;
	color: black;
`;

export const FilterColumnWrapper = styled.div`
	position: absolute;
	width: auto;
	min-width: 180px;
	margin-top: 10px;

	> *:first-child {
		border-left: 1px solid #eaeaea;
	}

	> *:last-child {
		border-right: 1px solid #eaeaea;
	}
`;
