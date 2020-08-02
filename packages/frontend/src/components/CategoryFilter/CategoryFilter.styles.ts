import styled from 'styled-components';

interface CategoryFilterWrapperProps {
	active: boolean;
}

export const CategoryFilterWrapper = styled.div<CategoryFilterWrapperProps>`
	border: 1px solid ${({ active }) => (active ? 'black' : '#eaeaea')};
	margin: 0 8px 8px 0;
	position: relative;
	z-index: 20;
`;

export const CategoryFilterButton = styled.button`
	background: white;
	border: none;
	border-radius: 0;
	padding: 4px 8px;
	cursor: pointer;

	&:focus {
		outline: none;
	}
`;

interface CategoryFilterDropdownProps {
	open: boolean;
}

export const CategoryFilterDropdown = styled.div<CategoryFilterDropdownProps>`
	position: absolute;
	display: ${({ open }) => (open ? 'block' : 'none')};
	background: white;
	border: 1px solid #eaeaea;
	min-width: 250px;
	margin-top: 8px;
	margin-left: -1px;
`;
