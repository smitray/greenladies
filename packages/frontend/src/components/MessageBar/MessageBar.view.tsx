import React from 'react';

import Link from 'next/link';

import { CenterWrapper } from '../../styles/center-wrapper';

import { MessageAnchor, MessageLeft, MessageList, MessageMiddle, MessageRight, Wrapper } from './MessageBar.styles';

const MessageBarView = () => {
	return (
		<Wrapper>
			<CenterWrapper>
				<MessageList>
					<MessageLeft>
						<Link href="/[[...slug]]?tab=om-green-ladies" as="/kundservice?tab=om-green-ladies" passHref>
							<MessageAnchor>Om Green Ladies</MessageAnchor>
						</Link>
					</MessageLeft>
					<MessageMiddle>
						<Link href="/[[...slug]]?tab=frakt" as="/kundservice?tab=frakt" passHref>
							<MessageAnchor>Fri frakt på beställningar över 999kr / Klimatkompenserad frakt</MessageAnchor>
						</Link>
					</MessageMiddle>
					<MessageRight>
						<Link href="/[[...slug]]?tab=betalning" as="/kundservice?tab=betalning" passHref>
							<MessageAnchor>Trygg & säker betalning</MessageAnchor>
						</Link>
					</MessageRight>
				</MessageList>
			</CenterWrapper>
		</Wrapper>
	);
};

export default MessageBarView;
