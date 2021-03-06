import React, { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { Collapse } from 'react-collapse';
import { FaTrashAlt } from 'react-icons/fa';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { fetchQuery } from 'react-relay';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { useWindowDimensions } from '../hooks/use-window-dimensions';
import { MyNextPage } from '../lib/types';
import {
	useAddCouponToCartMutation,
	useRemoveFromCartMutation,
	useUpdateCartAmountMutation,
} from '../mutations/shopping-cart';
import { CART_QUERY, CartQuery } from '../queries/cart';
import { CenterWrapper } from '../styles/center-wrapper';
import { IconWrapper } from '../styles/icon-wrapper';
import { NORMAL_TABLET_SIZE } from '../utils/device-size';

const SomeKindOfWrapper = styled.div`
	display: flex;
	align-items: flex-start;
	padding: 1.5em 0;
`;

interface CustomSummarProps {
	grandTotal: number;
	subTotal: number;
	discountAmount: number;
	shippingCost: number;
}

const CostSummary = ({ grandTotal, subTotal, discountAmount, shippingCost }: CustomSummarProps) => {
	const [coupon, setCoupon] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [couponInputOpen, setCouponInputOpen] = useState(false);

	const { commit: addCouponToCart } = useAddCouponToCartMutation();

	return (
		<React.Fragment>
			<h1 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>Totalsumma</h1>
			<div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
				<div>Deltotal</div>
				<div>{subTotal.toFixed(2).replace(',', '.')} kr</div>
			</div>
			{discountAmount > 0 && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						padding: '12px 0',
					}}
				>
					<div>Rabatt</div>
					<div>-{discountAmount.toFixed(2).replace(',', '.')} kr</div>
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
				<div>{shippingCost === 0 ? 'fri frakt' : `${shippingCost.toFixed(2).replace(',', '.')} kr`}</div>
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
				<div style={{ fontWeight: 'bold' }}>Totalsumma (inkl. moms)</div>
				<div style={{ fontWeight: 'bold' }}>{grandTotal.toFixed(2).replace(',', '.')} kr</div>
			</div>
			<div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						cursor: 'pointer',
						padding: '12px 0',
					}}
					onClick={() => setCouponInputOpen(o => !o)}
				>
					<span>L??gg till rabattkod</span>
					<IconWrapper size="20px">{couponInputOpen ? <FiMinus size="20px" /> : <FiPlus size="20px" />}</IconWrapper>
				</div>
				<Collapse isOpened={couponInputOpen}>
					<div style={{ paddingBottom: '12px' }}>
						<div style={{ display: 'flex' }}>
							<input
								style={{ padding: '8px', marginRight: '8px', flexGrow: 1, borderRadius: 0, border: '1px solid black' }}
								type="text"
								placeholder="Fyll i din rabattkod"
								value={coupon}
								onChange={e => {
									setErrorMessage(null);
									setCoupon(e.target.value);
								}}
							/>
							<button
								style={{
									padding: '8px 16px',
									background: 'white',
									border: '1px solid black',
									fontWeight: 'bold',
									cursor: 'pointer',
								}}
								onClick={() => {
									addCouponToCart(coupon)
										.then(() => setCoupon(''))
										.catch(() => setErrorMessage('Kunde inte l??gga till rabattkoden'));
								}}
							>
								L??gg till
							</button>
						</div>
						{errorMessage && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errorMessage}</div>}
					</div>
				</Collapse>
			</div>
			<Link href="/checkout" passHref>
				<a
					style={{
						display: 'block',
						textDecoration: 'none',
						background: '#024b3f',
						width: '100%',
						padding: '12px',
						color: 'white',
						fontWeight: 'bold',
						cursor: 'pointer',
						fontSize: '14px',
						textAlign: 'center',
					}}
				>
					G?? TILL KASSAN
				</a>
			</Link>
		</React.Fragment>
	);
};

const Cart: MyNextPage = () => {
	const { shoppingCart } = useLazyLoadQuery<CartQuery>(CART_QUERY, {}, { fetchPolicy: 'store-only' });

	const { width: windowWidth } = useWindowDimensions();

	const { commit: removeFromCart } = useRemoveFromCartMutation();
	const { commit: updateCartAmount } = useUpdateCartAmountMutation();

	return (
		<React.Fragment>
			<Head>
				<title>Varukorg | greenladies.se</title>
				<meta name="robots" content="noindex,nofollow" />
			</Head>
			<CenterWrapper>
				<SomeKindOfWrapper>
					<div style={{ flexGrow: 1 }}>
						<div>
							<h1 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>Varukorg</h1>
							<ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
								{shoppingCart.items.edges.map(({ node: item }) => {
									return (
										<li key={item.id} style={{ padding: '24px 0', borderBottom: '1px solid lightgrey' }}>
											<div style={{ display: 'flex' }}>
												<div style={{ flexBasis: '80px' }}>
													<img src={item.product.parent.image} alt="" style={{ width: '100%' }} />
												</div>
												<div style={{ marginLeft: '12px', flexGrow: 1 }}>
													<div style={{ marginBottom: '2px' }}>{item.product.parent.brand}</div>
													<div style={{ marginBottom: '4px', color: 'grey' }}>{item.product.name}</div>
													<div style={{ marginBottom: '24px', color: 'grey' }}>Storlek {item.product.size}</div>
													<button
														style={{
															display: 'flex',
															padding: '4px',
															border: 'none',
															outline: 'none',
															background: 'none',
															color: 'grey',
															cursor: 'pointer',
														}}
														onClick={() => removeFromCart(item.id)}
													>
														<div style={{ width: '14px', height: '14px' }}>
															<FaTrashAlt size="14" />
														</div>
														<span style={{ marginLeft: '4px' }}>Ta bort</span>
													</button>
												</div>
												<div
													style={{
														marginLeft: '12px',
														display: 'flex',
														flexDirection: 'column',
														justifyContent: 'space-between',
													}}
												>
													<div style={{ textAlign: 'right' }}>
														<select
															style={{
																width: '100px',
																outline: 'none',
																border: '1px solid black',
																background: 'white',
																padding: '8px 12px',
															}}
															disabled={item.product.quantity === 1}
															onChange={e => {
																const amount = parseInt(e.target.value, 10);
																if (amount > 0 && amount <= 10) {
																	updateCartAmount(item.id, amount);
																}
															}}
															value={item.amount}
														>
															{Array.from({ length: Math.min(item.product.quantity, 10) }, (_, i) => i + 1).map(
																amount => (
																	<option key={amount}>{amount}</option>
																),
															)}
														</select>
													</div>
													<div>
														<div
															style={{
																marginBottom: '4px',
																display: 'flex',
																flexDirection: windowWidth < NORMAL_TABLET_SIZE ? 'column' : 'row',
																alignItems: 'flex-end',
															}}
														>
															<div
																style={{
																	textDecoration: 'line-through',
																	whiteSpace: 'nowrap',

																	marginRight: windowWidth < NORMAL_TABLET_SIZE ? '0' : '16px',
																	marginBottom: windowWidth < NORMAL_TABLET_SIZE ? '4px' : '0',
																}}
															>
																{(item.product.originalPrice * item.amount).toFixed(2).replace('.', ',')} kr
															</div>
															<div style={{ color: 'red', whiteSpace: 'nowrap' }}>
																{(item.product.specialPrice * item.amount).toFixed(2).replace('.', ',')} kr
															</div>
														</div>
														<div style={{ fontSize: '14px', color: 'red', textAlign: 'right' }}>
															Du sparar{' '}
															{Math.round(
																((item.product.originalPrice - item.product.specialPrice) /
																	item.product.originalPrice) *
																	100,
															)}
															%
														</div>
													</div>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
						{windowWidth <= 961 && (
							<div style={{ padding: '48px 0 24px 0' }}>
								<CostSummary
									grandTotal={shoppingCart.grandTotal}
									subTotal={shoppingCart.subTotal}
									discountAmount={shoppingCart.discountAmount}
									shippingCost={shoppingCart.shippingCost}
								/>
							</div>
						)}
						<div style={{ background: 'white', padding: '24px 0' }}>
							<h1 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>Vi skickar med</h1>
							<img src="/images/dhl.jpg" alt="" />
						</div>
						<div style={{ background: 'white', padding: '24px 0' }}>
							<h1 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>Vi accepterar</h1>
							<div>
								<img style={{ marginLeft: '8px', height: '48px' }} src="/images/klarna.jpg" alt="" />
								<img style={{ marginLeft: '8px', height: '48px' }} src="/images/visa.png" alt="" />
								<img style={{ marginLeft: '8px', height: '48px' }} src="/images/mastercard.png" alt="" />
								<img style={{ marginLeft: '8px', height: '48px' }} src="/images/amex.png" alt="" />
								<img style={{ marginLeft: '8px', height: '48px' }} src="/images/faktura.png" alt="" />
							</div>
						</div>
					</div>
					{windowWidth > 961 && (
						<div
							style={{ background: 'white', padding: '24px', marginLeft: '24px', flexBasis: '360px', flexShrink: 0 }}
						>
							<CostSummary
								grandTotal={shoppingCart.grandTotal}
								subTotal={shoppingCart.subTotal}
								discountAmount={shoppingCart.discountAmount}
								shippingCost={shoppingCart.shippingCost}
							/>
						</div>
					)}
				</SomeKindOfWrapper>
			</CenterWrapper>
		</React.Fragment>
	);
};

Cart.getInitialProps = async ({ relayEnvironment }) => {
	await fetchQuery<CartQuery>(relayEnvironment, CART_QUERY, {});

	return {};
};

export default Cart;
