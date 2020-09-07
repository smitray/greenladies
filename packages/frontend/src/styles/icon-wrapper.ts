import styled from 'styled-components';

interface IconWrapperProps {
	size: number;
}

export const IconWrapper = styled.div<IconWrapperProps>`
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
`;
