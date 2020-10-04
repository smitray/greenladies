import styled from 'styled-components';

type Size = 'xs' | 's' | 'm' | 'l' | 'xl';

const sizeToWidth: Record<Size, number> = {
	xs: 320,
	s: 481,
	m: 641,
	l: 961,
	xl: 1281,
};

interface ShowOnMinSizeProps {
	size: Size;
}

export const ShowOnMinSize = styled.div<ShowOnMinSizeProps>`
	display: none;

	@media (min-width: ${({ size }) => sizeToWidth[size]}px) {
		display: block;
	}
`;

interface HideOnMinSizeProps {
	size: Size;
}

export const HideOnMinSize = styled.div<HideOnMinSizeProps>`
	display: block;

	@media (min-width: ${({ size }) => sizeToWidth[size]}px) {
		display: none;
	}
`;
