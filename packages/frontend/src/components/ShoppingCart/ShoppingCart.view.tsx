import React from 'react';

import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';

import { useShoppingCartModal } from '../../contexts/shopping-cart-model-context';
import { useRemoveFromCartMutation } from '../../mutations/shopping-cart';

import { ShoppingCart_cart } from './__generated__/ShoppingCart_cart.graphql';

interface ShoppingCartViewProps {
	cart: ShoppingCart_cart;
	isMobile?: boolean;
}

const ShoppingCartView = ({ cart, isMobile }: ShoppingCartViewProps) => {
	const { commit: removeFromCart } = useRemoveFromCartMutation();
	const { close: closeShoppingCartModal } = useShoppingCartModal();

	return (
		<React.Fragment>
			<div style={{ overflowY: 'auto', flexGrow: 1 }}>
				{cart.items.totalCount === 0 && <div style={{ color: 'grey', padding: '8px 0' }}>Din varukorg är tom</div>}
				{cart.items.totalCount > 0 && (
					<ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
						{cart.items.edges.map(({ node: item }) => (
							<li key={item.id} style={{ margin: '0 8px', padding: '16px 0', borderBottom: '2px solid grey' }}>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div style={{ flexBasis: '70px', flexShrink: 0 }}>
										<img src={item.product.parent.image} alt="" style={{ width: '100%' }} />
									</div>
									<div style={{ overflow: 'hidden', flexGrow: 1 }}>
										<div style={{ display: 'flex', marginLeft: '16px' }}>
											<div style={{ maxWidth: '130px' }}>
												<div
													style={{
														whiteSpace: 'nowrap',
														textOverflow: 'ellipsis',
														overflow: 'hidden',
														textAlign: 'left',
														marginBottom: '8px',
													}}
												>
													{item.product.parent.brand}
												</div>
												<div
													style={{
														whiteSpace: 'nowrap',
														textOverflow: 'ellipsis',
														overflow: 'hidden',
														textAlign: 'left',
														marginBottom: '2px',
													}}
												>
													{item.product.name}
												</div>
												<div style={{ whiteSpace: 'nowrap', textAlign: 'left', color: 'grey', marginBottom: '2px' }}>
													Storlek: {item.product.size}
												</div>
												<div style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>
													<span style={{ color: 'grey' }}>Antal: {item.amount}</span>
													{item.product.quantity < 3 && (
														<span style={{ marginLeft: '4px', fontWeight: 'bold', color: 'red', marginBottom: '2px' }}>
															Bara {item.product.quantity} kvar
														</span>
													)}
												</div>
											</div>
											<div style={{ marginLeft: '8px', flexGrow: 1 }}>
												<div
													style={{
														textAlign: 'right',
														fontWeight: 'bold',
														color: 'red',
														fontSize: '16px',
														whiteSpace: 'nowrap',
														marginBottom: '2px',
													}}
												>
													{item.product.specialPrice.toFixed(2).replace('.', ',')} kr
												</div>
												<div
													style={{
														textAlign: 'right',
														color: 'grey',
														textDecoration: 'line-through',
														fontSize: '14px',
														whiteSpace: 'nowrap',
													}}
												>
													{item.product.originalPrice.toFixed(2).replace('.', ',')} kr
												</div>
											</div>
										</div>
										<div>
											<div
												style={{ color: 'grey', textAlign: 'right', cursor: 'pointer', marginTop: '16px' }}
												onClick={() => removeFromCart(item.id)}
											>
												Ta bort produkt
											</div>
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
			<div style={{ padding: '24px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
					<div style={{ fontSize: '16px' }}>Frakt</div>
					<div style={{ fontSize: '16px' }}>
						{cart.shippingCost === 0 ? 'fri frakt' : `${cart.shippingCost.toFixed(2).replace('.', ',')} kr`}
					</div>
				</div>
				{cart.discountAmount > 0 && (
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
						<div style={{ fontSize: '16px' }}>Rabatt</div>
						<div style={{ fontSize: '16px' }}>-{cart.discountAmount.toFixed(2).replace('.', ',')} kr</div>
					</div>
				)}
				<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
					<div>
						<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Totalsumma</span>
						<span style={{ fontSize: '14px', color: 'lightgrey', marginLeft: '8px' }}>(inkl. moms)</span>
					</div>
					<div style={{ fontSize: '18px', fontWeight: 'bold' }}>{cart.grandTotal.toFixed(2).replace('.', ',')} kr</div>
				</div>
				{cart.items.totalCount === 0 ? (
					<div
						style={{
							display: 'block',
							textDecoration: 'none',
							background: 'rgba(2, 75, 53, 0.5)',
							color: 'white',
							fontSize: '14px',
							fontWeight: 'bold',
							padding: '12px',
							width: '100%',
							cursor: 'not-allowed',
							textAlign: 'center',
						}}
					>
						{isMobile ? 'TILL KASSAN' : 'TILL VARUKORGEN'}
					</div>
				) : (
					<Link href={isMobile ? '/checkout' : '/cart'} passHref>
						<a
							style={{
								display: 'block',
								textDecoration: 'none',
								background: '#024b3f',
								color: 'white',
								fontSize: '14px',
								fontWeight: 'bold',
								padding: '12px',
								width: '100%',
								cursor: 'pointer',
								textAlign: 'center',
							}}
							onClick={() => closeShoppingCartModal()}
						>
							{isMobile ? 'TILL KASSAN' : 'TILL VARUKORGEN'}
						</a>
					</Link>
				)}
			</div>
		</React.Fragment>
	);
};

export default createFragmentContainer(ShoppingCartView, {
	cart: graphql`
		fragment ShoppingCart_cart on ShoppingCart {
			id
			items(first: 10000) @connection(key: "ShoppingCart_items") {
				edges {
					node {
						id
						amount
						product {
							quantity
							name
							size
							originalPrice
							specialPrice
							parent {
								brand
								image
							}
						}
					}
				}
				totalCount
			}
			discountAmount
			grandTotal
			shippingCost
		}
	`,
});
