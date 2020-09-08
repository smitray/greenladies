import styled from 'styled-components';

export const Wrapper = styled.div`
	background: #eeeeee;
	display: none;

	@media (min-width: 641px) {
		display: block;
	}
`;

export const MessageList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	justify-content: space-between;
`;

const Message = styled.li`
	padding: 8px 8px;
`;

export const MessageLeft = styled(Message)`
	padding-left: 0;
`;

export const MessageMiddle = styled(Message)`
	text-align: center;
`;

export const MessageRight = styled(Message)`
	padding-right: 0;
	text-align: right;
`;

export const MessageAnchor = styled.a`
	font-size: 10px;
	line-height: 14px;
	color: #666666;
	text-transform: uppercase;
	font-weight: bold;
	text-decoration: none;
	border-bottom: 1px solid #666666;
`;
