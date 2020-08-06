import styled from 'styled-components';

export const Wrapper = styled.nav`
	padding: 15px 0;
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

export const Item = styled.div`
	padding: 20px 0;
	position: relative;
	font-size: 15px;

	&::after {
		content: '';
		position: absolute;
		display: block;
		left: 0;
		right: 0;

		margin-top: 5px;
		background: black;
		height: 2px;
		opacity: 0;
		transform: scaleX(0);

		transition: all 300ms;
	}
`;

export const ItemText = styled.span`
	font-family: 'Cerebri Sans', sans-serif;
	display: block;
`;

export const ItemWrapper = styled.a`
	display: block;
	padding: 0 20px;
	cursor: pointer;

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
	height: 360px;
	max-height: ${({ open }) => (open ? '360px' : '0')};
`;
