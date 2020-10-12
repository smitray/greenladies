import styled from 'styled-components';

import { CenterWrapper } from '../../../../styles/center-wrapper';

export const DesktopSignupWrapper = styled.div`
	background: #eae7e2;
	padding: 32px 0;
	margin-bottom: 48px;
`;

export const DesktopSignupCenterWrapper = styled(CenterWrapper)`
	display: flex;
	justify-content: space-between;
`;

export const DesktopSignupImage = styled.div`
	background: url(/images/email-signup-1.jpg);
	background-size: cover;
	background-position: center;
	width: 100%;
	max-width: 600px;
	margin-left: 64px;
`;
