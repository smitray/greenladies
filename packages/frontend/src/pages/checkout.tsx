import React, { useEffect, useRef } from 'react';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { useWindowDimensions } from '../hooks/use-window-dimensions';
import { MyNextPage } from '../lib/types';
import { CHECKOUT_QUERY, CheckoutQuery } from '../queries/checkout';
import { CenterWrapper } from '../styles/center-wrapper';

const SomeKindOfWrapper = styled.div`
	display: flex;
	align-items: flex-start;
	padding: 24px 0;
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

	const { width: windowWidth } = useWindowDimensions();

	return (
		<React.Fragment>
			<Head>
				<title>Utcheckning | greenladies.se</title>
				<meta name="robots" content="noindex,nofollow" />
			</Head>
			<CenterWrapper>
				<SomeKindOfWrapper>
					<div style={{ flexGrow: 1 }}>
						<div style={{ flexBasis: '640px' }}>
							<h1 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>Betalning</h1>
							<CheckoutIframeDynamic snippet={shoppingCart.klarnaCartSnippet} />
						</div>
					</div>
					{windowWidth >= 961 && (
						<div style={{ background: 'white', marginLeft: '24px', flexBasis: '360px', flexShrink: 0 }}>
							<h1 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>Översikt</h1>
							<div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
								<div>Deltotal</div>
								<div>{shoppingCart.subTotal.toFixed(2).replace(',', '.')} kr</div>
							</div>
							{shoppingCart.discountAmount > 0 && (
								<div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
									<div>Rabatt</div>
									<div>-{shoppingCart.discountAmount.toFixed(2).replace(',', '.')} kr</div>
								</div>
							)}
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									borderBottom: '1px solid lightgrey',
									padding: '12px 0',
								}}
							>
								<div>Frakt</div>
								<div>
									{shoppingCart.shippingCost === 0
										? 'fri frakt'
										: `${shoppingCart.shippingCost.toFixed(2).replace(',', '.')} kr`}
								</div>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 24px 0' }}>
								<div style={{ fontWeight: 'bold' }}>Totalsumma (inkl. moms)</div>
								<div style={{ fontWeight: 'bold' }}>{shoppingCart.grandTotal.toFixed(2).replace(',', '.')} kr</div>
							</div>
						</div>
					)}
				</SomeKindOfWrapper>
			</CenterWrapper>
		</React.Fragment>
	);
};

Checkout.getInitialProps = async ({ relayEnvironment }) => {
	await fetchQuery<CheckoutQuery>(relayEnvironment, CHECKOUT_QUERY, {});

	return {};
};

export default Checkout;
