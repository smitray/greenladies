import styled from 'styled-components';

import { IconWrapper } from '../../../../styles/icon-wrapper';

export const CardWrapper = styled.div`
	padding: 32px;
	background: white;
	max-width: 480px;
`;

export const SignupTitle = styled.div`
	font-size: 24px;
	font-weight: bold;
	text-align: center;
	margin-bottom: 18px;

	@media (min-width: 550px) {
		font-size: 32px;
	}
`;

export const SignupText = styled.p`
	font-family: Arimo, sans-serif;
	font-size: 16px;
	text-align: center;
	line-height: 1.3;
	margin-top: 0;
	margin-bottom: 32px;

	@media (min-width: 550px) {
		font-size: 20px;
		padding: 0 48px;
	}
`;

export const SignupTextInput = styled.input`
	border: 1px solid #ccc;
	border-radius: 4px;
	padding: 12px 10px;
	width: 100%;
	font-size: 14px;
	margin-bottom: 12px;
`;

export const SignupSubmitButton = styled.button`
	border-radius: 4px;
	background: black;
	color: white;
	text-align: center;
	width: 100%;
	padding: 12px 10px;
	border: none;
	position: relative;
	margin-bottom: 12px;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
`;

export const SignupIconWrapper = styled(IconWrapper)`
	position: absolute;
	right: 8px;
	top: 8px;
`;

export const SignupErrorMessage = styled.div`
	color: red;
	font-size: 14px;
	margin-top: -8px;
	margin-bottom: 12px;
`;

export const SignupSuccessMessage = styled.div`
	font-size: 14px;
	margin-top: -8px;
	margin-bottom: 12px;
	text-align: center;
`;

export const SignupDisclaimer = styled.div`
	font-size: 12px;
	color: #222;
	text-align: center;
	padding: 0 16px;
`;

export const SignupDisclaimerLink = styled.a`
	color: #222;
`;
