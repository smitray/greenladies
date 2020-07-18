import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
	background: #eeeeee;
`;

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
`;

const MessageList = styled.ul`
	margin: 0;
	list-style: none;
	display: flex;
`;

const Message = styled.li`
	padding: 9px 80px;
	flex-basis: 33.33%;
`;

const MessageLeft = styled(Message)`
	padding-left: 0;
`;
const MessageMiddle = styled(Message)`
	text-align: center;
`;
const MessageRight = styled(Message)`
	padding-right: 0;
	text-align: right;
`;

const MessageAnchor = styled.a`
	font-family: 'Cerebri Sans', sans-serif;
	font-size: 10px;
	line-height: 14px;
	color: #666666;
	text-transform: uppercase;
	font-weight: bold;
	text-decoration: none;
	border-bottom: 1px solid #666666;
`;

const MessageBarView = () => {
	return (
		<Wrapper>
			<CenterWrapper>
				<MessageList>
					<MessageLeft>
						<MessageAnchor href="/om-green-ladies">Om Green Ladies</MessageAnchor>
					</MessageLeft>
					<MessageMiddle>
						<MessageAnchor href="/kopvillkor">Köpvillkor*</MessageAnchor>
					</MessageMiddle>
					<MessageRight>
						<MessageAnchor href="/kopvillkor">Trygga & säkra betalningar</MessageAnchor>
					</MessageRight>
				</MessageList>
			</CenterWrapper>
		</Wrapper>
	);
};

export default MessageBarView;
