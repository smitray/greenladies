import styled from 'styled-components';

import { ListItem } from '../shared/list';

export const ListItemWithImage = styled(ListItem)`
	padding: 4px 0;
	color: #444444;
	text-decoration: none;
	font-size: 14px;
	display: flex;
	align-items: center;
`;

export const ListItemImageWrapper = styled.div`
	width: 24px;
	height: 28px;
	display: flex;
	align-items: center;

	> img {
		width: 100%;
	}
`;

export const ListItemImageText = styled.span`
	margin-left: 8px;
`;
