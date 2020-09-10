import React, { useEffect, useRef } from 'react';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { MyNextPage } from '../../lib/types';
import { ORDER_SUCCESS_QUERY, OrderSuccessQuery } from '../../queries/order-success';
import { CenterWrapper } from '../../styles/center-wrapper';

const SomeKindOfWrapper = styled.div`
	padding: 24px 0;
	display: flex;
	align-items: flex-start;
	justify-content: center;
`;

interface Props {
	orderId: string;
}

interface OrderSuccessIframeProps {
	snippet: string;
}

const OrderSuccessIframe = ({ snippet }: OrderSuccessIframeProps) => {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref.current) {
			const scriptsTags = ref.current.getElementsByTagName('script');
			// This is necessary otherwise the scripts tags are not going to be evaluated
			for (let i = 0; i < scriptsTags.length; i++) {
				const parentNode = scriptsTags[i].parentNode;
				const newScriptTag = document.createElement('script');
				newScriptTag.type = 'text/javascript';
				newScriptTag.text = scriptsTags[i].text;
				if (parentNode) {
					parentNode.removeChild(scriptsTags[i]);
					parentNode.appendChild(newScriptTag);
				}
			}
		}
	}, [ref]);

	return <div style={{ flexBasis: '640px' }} ref={ref} dangerouslySetInnerHTML={{ __html: snippet }}></div>;
};

const OrderSuccessIframeDynamic = dynamic(() => Promise.resolve(OrderSuccessIframe), {
	ssr: false,
});

const OrderSuccess: MyNextPage<Props> = ({ orderId }) => {
	const { klarnaOrderConfirmationSnippet } = useLazyLoadQuery<OrderSuccessQuery>(
		ORDER_SUCCESS_QUERY,
		{ orderId },
		{ fetchPolicy: 'store-only' },
	);

	return (
		<React.Fragment>
			<Head>
				<title>Orderbekräftelse | greenladies.se</title>
				<meta name="robots" content="noindex,nofollow" />
			</Head>
			<CenterWrapper>
				<SomeKindOfWrapper>
					<OrderSuccessIframeDynamic snippet={klarnaOrderConfirmationSnippet} />
				</SomeKindOfWrapper>
			</CenterWrapper>
		</React.Fragment>
	);
};

OrderSuccess.getInitialProps = async ({ relayEnvironment, query }) => {
	const { orderId: _orderId } = query;
	const orderId = typeof _orderId === 'string' ? _orderId : '';
	await fetchQuery<OrderSuccessQuery>(relayEnvironment, ORDER_SUCCESS_QUERY, {
		orderId,
	});

	return { orderId };
};

export default OrderSuccess;
