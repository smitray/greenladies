import styled from 'styled-components';

export const ImageList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;

	display: flex;
	flex-wrap: wrap;
`;

export const ImageListItem = styled.li`
	> img {
		flex-basis: 70px;
		width: 70px;
		margin-right: 8px;
		margin-bottom: 8px;
	}
`;
