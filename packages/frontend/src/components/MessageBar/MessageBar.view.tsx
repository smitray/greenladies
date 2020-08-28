import React from 'react';

import Link from 'next/link';

import {
	CenterWrapper,
	MessageAnchor,
	MessageLeft,
	MessageList,
	MessageMiddle,
	MessageRight,
	Wrapper,
} from './MessageBar.styles';

const MessageBarView = () => {
	return (
		<Wrapper>
			<CenterWrapper>
				<MessageList>
					<MessageLeft>
						<Link href="/om-oss" passHref>
							<MessageAnchor>Om Green Ladies</MessageAnchor>
						</Link>
					</MessageLeft>
					<MessageMiddle>
						<Link href="/kundservice" passHref>
							<MessageAnchor>Fri frakt på beställningar över 999kr / Klimatkompenserad frakt</MessageAnchor>
						</Link>
					</MessageMiddle>
					<MessageRight>
						<Link href="/kundservice" passHref>
							<MessageAnchor>Trygg & säker betalning</MessageAnchor>
						</Link>
					</MessageRight>
				</MessageList>
			</CenterWrapper>
		</Wrapper>
	);
};

export default MessageBarView;
