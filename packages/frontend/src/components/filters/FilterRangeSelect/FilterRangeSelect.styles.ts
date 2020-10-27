import styled from 'styled-components';

export const RangeInputContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
	width: 280px;
`;

export const RangeInputWrapper = styled.div`
	position: relative;
	flex: 0 1 110px;
`;

export const RangeInput = styled.input`
	border: 1px solid #eaeaea;
	padding: 0 32px 0 8px;
	outline: none;
	width: 100%;
	height: 40px;

	&:hover {
		background: #eaeaea;
	}
`;

export const RangeInputPostfix = styled.div`
	position: absolute;
	top: 0;
	right: 12px;
	line-height: 40px;
	color: #1a1a1a;
	text-align: center;
`;

export const RangeInputSeparator = styled.div`
	flex: 0 0 24px;
	height: 1px;
	background: #ddd;
	margin: 0 16px;
`;

export const RangeWrapper = styled.div`
	padding: 0 12px;
	margin-bottom: 12px;
`;

export const RangeSliderKnob = styled.div`
	background: black;
	border-radius: 100%;
	position: absolute;
	transform: translateX(-50%);
	transition: all 50ms ease -in -out;
	cursor: pointer;
`;
