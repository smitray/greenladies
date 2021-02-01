import styled from 'styled-components';

import { CenterWrapper } from '../../../../styles/center-wrapper';

export const MobileSignupWrapper = styled.div`
	background: url(/images/email-signup.jpg);
	background-size: cover;
	background-position: center;
	padding: 32px 24px;
`;

export const MobileSignupCenterWrapper = styled(CenterWrapper)`
	display: flex;
	justify-content: center;
`;
