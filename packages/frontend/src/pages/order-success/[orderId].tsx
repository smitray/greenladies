import React, { useEffect, useRef } from 'react';

import dynamic from 'next/dynamic';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { MyNextPage } from '../../lib/types';
import { ORDER_SUCCESS_QUERY, OrderSuccessQuery } from '../../queries/order-success';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	padding: 24px;
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
		<CenterWrapper>
			<OrderSuccessIframeDynamic snippet={klarnaOrderConfirmationSnippet} />
		</CenterWrapper>
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
