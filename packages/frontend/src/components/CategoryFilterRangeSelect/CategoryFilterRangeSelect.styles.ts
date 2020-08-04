import styled from 'styled-components';

export const RangeInputWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
	width: 280px;
`;

export const RangeInput = styled.input`
	border: 1px solid #eaeaea;
	border-radius: 4px;
	padding: 12px 8px;
	outline: none;
	flex: 0 1 110px;
	width: 100%;

	&:hover {
		background: #eaeaea;
	}
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
