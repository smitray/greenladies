import styled from 'styled-components';

const Column = styled.ul`
	margin: 0;
	padding: 12px 12px 48px 12px;
	list-style: none;
	border-top: 1px solid #eaeaea;
	border-bottom: 1px solid #eaeaea;
	background: white;
	top: 0;
	min-width: 180px;
`;

interface LeftColumnProps {
	extractedWidth: number;
}

export const LeftColumn = styled(Column)<LeftColumnProps>`
	position: absolute;
	left: ${({ extractedWidth }) => `-${extractedWidth}px`};
`;

export const MiddleColumn = styled(Column)``;

export const RightColumn = styled(Column)`
	position: absolute;
	left: 100%;
`;

export const CloseButton = styled.button`
	padding: 4px 8px;
	position: absolute;
	bottom: 12px;
	right: 12px;
	background: white;
	border: none;
	cursor: pointer;

	&:focus {
		outline: none;
	}

	&:hover {
		background: #eaeaea;
	}
`;

interface CategoryFilterColumnListItemProps {
	selected: boolean;
}

export const CategoryFilterColumnListItem = styled.li<CategoryFilterColumnListItemProps>`
	padding: 8px;
	font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
	cursor: pointer;

	&:hover {
		background: #eaeaea;
	}
`;
