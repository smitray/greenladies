import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { ShoppingCart } from '../ShoppingCart';

import { ShoppingCartModal_cart } from './__generated__/ShoppingCartModal_cart.graphql';

interface ShoppingCartModalViewProps {
	cart: ShoppingCartModal_cart;
}

const ShoppingCartModalView = ({ cart }: ShoppingCartModalViewProps) => {
	return (
		<div
			style={{
				background: 'white',
				width: '330px',
				maxHeight: '600px',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div style={{ padding: '24px 8px 8px 8px', fontSize: '22px', fontWeight: 'bold' }}>VARUKORG</div>
			<ShoppingCart cart={cart} />
		</div>
	);
};

export default createFragmentContainer(ShoppingCartModalView, {
	cart: graphql`
		fragment ShoppingCartModal_cart on ShoppingCart {
			...ShoppingCart_cart
		}
	`,
});
