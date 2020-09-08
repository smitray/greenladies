import styled from 'styled-components';

interface IconWrapperProps {
	size: string;
}

export const IconWrapper = styled.div<IconWrapperProps>`
	width: ${({ size }) => size};
	height: ${({ size }) => size};
`;
