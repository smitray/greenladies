import React from 'react';
import {
	Wrapper,
	CenterWrapper,
	MessageAnchor,
	MessageLeft,
	MessageList,
	MessageMiddle,
	MessageRight,
} from './MessageBar.styles';

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
