import styled from 'styled-components';

export const Wrapper = styled.nav`
	padding-bottom: 0px;
`;

export const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
`;

export const Row = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const Group = styled.ul`
	display: flex;
	list-style: none;
	margin: 0;
	padding: 0;
`;

interface ItemProps {
	active: boolean;
}

export const Item = styled.div<ItemProps>`
	padding: 16px 0 15px 0;
	position: relative;
	font-size: 15px;
	border-bottom: 1px solid ${({ active }) => (active ? 'black' : 'white')};

	&:hover {
		border-bottom: 1px solid black;
	}
`;

export const ItemText = styled.span`
	font-family: 'Cerebri Sans', sans-serif;
	display: block;
	color: black;
`;

export const ItemWrapper = styled.a`
	display: block;
	padding: 0 12px;
	cursor: pointer;
	text-decoration: none;

	&:hover ${Item}::after {
		transform: scaleX(1);
		opacity: 1;
	}
`;

interface MegaMenuProps {
	open: boolean;
}

export const MegaMenu = styled.div<MegaMenuProps>`
	width: 100%;
	background: white;
	position: absolute;
	z-index: 100;
	transition: all 300ms ease-in-out;
	overflow: hidden;
	height: 300px;
	max-height: ${({ open }) => (open ? '300px' : '0')};
`;
