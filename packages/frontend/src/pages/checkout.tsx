import React, { useEffect, useRef } from 'react';

import dynamic from 'next/dynamic';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { MyNextPage } from '../lib/types';
import { CHECKOUT_QUERY, CheckoutQuery } from '../queries/checkout';

const CenterWrapper = styled.div`
	max-width: 1240px;
	padding: 0 40px;
	margin: 0 auto;
	background: lightgrey;
	padding: 24px;
	display: flex;
	align-items: flex-start;
`;

interface CheckoutIframeProps {
	snippet: string;
}

const CheckoutIframe = ({ snippet }: CheckoutIframeProps) => {
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

	return <div ref={ref} dangerouslySetInnerHTML={{ __html: snippet }}></div>;
};

const CheckoutIframeDynamic = dynamic(() => Promise.resolve(CheckoutIframe), {
	ssr: false,
});

const Checkout: MyNextPage = () => {
	const { shoppingCart } = useLazyLoadQuery<CheckoutQuery>(CHECKOUT_QUERY, {}, { fetchPolicy: 'store-only' });

	const itemCost = shoppingCart.items.edges.reduce(
		(prev, { node: item }) => prev + item.amount * item.product.specialPrice,
		0,
	);
	const shippingCost = itemCost > 999 ? 0 : 59;
	const numberOfItems = shoppingCart.items.edges.reduce((prev, { node: item }) => prev + item.amount, 0);

	return (
		<CenterWrapper>
			<div style={{ flexGrow: 1 }}>
				<div style={{ background: 'white', padding: '24px', flexBasis: '640px' }}>
					<h1 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>Betalning</h1>
					<CheckoutIframeDynamic snippet={shoppingCart.klarnaCartSnippet} />
				</div>
			</div>
			<div style={{ background: 'white', padding: '24px', marginLeft: '24px', flexBasis: '360px', flexShrink: 0 }}>
				<h1 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>Översikt ({numberOfItems} varor)</h1>
				<div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
					<div>Deltotal</div>
					<div>{itemCost.toFixed(2).replace(',', '.')} kr</div>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						borderBottom: '1px solid lightgrey',
						padding: '12px 0',
					}}
				>
					<div>Frakt</div>
					<div>{shippingCost === 0 ? 'fri frakt' : `${shippingCost.toFixed(2).replace(',', '.')} kr`}</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 24px 0' }}>
					<div style={{ fontWeight: 'bold' }}>Totalsumma (inkl. moms)</div>
					<div style={{ fontWeight: 'bold' }}>{(itemCost + shippingCost).toFixed(2).replace(',', '.')} kr</div>
				</div>
			</div>
		</CenterWrapper>
	);
};

Checkout.getInitialProps = async ({ relayEnvironment }) => {
	await fetchQuery<CheckoutQuery>(relayEnvironment, CHECKOUT_QUERY, {});

	return {};
};

export default Checkout;
