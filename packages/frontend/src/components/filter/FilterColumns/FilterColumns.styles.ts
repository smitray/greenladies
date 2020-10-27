import styled from 'styled-components';

interface ColumnWrapperProps {
	extractedWidth: number;
}

export const ColumnWrapper = styled.div<ColumnWrapperProps>`
	position: absolute;
	left: ${({ extractedWidth }) => `-${extractedWidth}px`};
	background: white;
	border: 1px solid #eaeaea;
`;

export const ColumnContainer = styled.div`
	max-height: 370px;
	overflow: auto;
	display: flex;
`;

export const Column = styled.ul`
	margin: 0;
	padding: 12px;
	list-style: none;
	background: white;
	// top: 0;
	min-width: 180px;
`;

export const CloseButtonWrapper = styled.div`
	display: flex;
	flex-direction: row-reverse;
	padding: 12px;
`;

export const CloseButton = styled.button`
	padding: 4px 8px;
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

interface FilterColumnListItemProps {
	selected: boolean;
}

export const FilterColumnListItem = styled.li<FilterColumnListItemProps>`
	padding: 8px;
	font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
	cursor: pointer;

	&:hover {
		background: #eaeaea;
	}
`;
