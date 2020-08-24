import React, { useEffect, useMemo, useState } from 'react';

import Drawer from 'rc-drawer';
import { createFragmentContainer, graphql } from 'react-relay';

import { useRemoveFromCartMutation, useUpdateCartAmountMutation } from '../../mutations/shopping-cart';

import { ShoppingCart_cart } from './__generated__/ShoppingCart_cart.graphql';

interface WishlistViewProps {
	cart: ShoppingCart_cart;
	open: boolean;
	onCloseRequest: () => void;
}

const ShoppingCartView = ({ cart, open, onCloseRequest }: WishlistViewProps) => {
	const items = useMemo(() => cart.items.edges.map(edge => edge.node), [cart]);
	const { commit: removeFromCart } = useRemoveFromCartMutation();
	const { commit: updateCartAmount } = useUpdateCartAmountMutation();
	const [inputs, setInputs] = useState(items.map(item => item.amount));

	useEffect(() => {
		setInputs(items.map(item => item.amount));
	}, [items]);

	return (
		<Drawer open={open} placement="right" handler={false} width={300} onClose={onCloseRequest}>
			<div>
				{items.length === 0 && <div>Your cart is empty</div>}
				{items.length > 0 &&
					items.map((item, index) => (
						<div key={item.id}>
							{item.product.name} ({item.product.size}) [{item.amount}]
							<button onClick={() => removeFromCart(item.id)}>REMOVE</button>
							<input
								type="number"
								value={inputs[index]}
								onChange={e => {
									e.persist();
									setInputs(inputs => inputs.map((input, i) => (i === index ? parseInt(e.target.value, 10) : input)));
								}}
							/>
							<button onClick={() => updateCartAmount(item.id, inputs[index])}>UPDATE</button>
						</div>
					))}
			</div>
		</Drawer>
	);
};

export default createFragmentContainer(ShoppingCartView, {
	cart: graphql`
		fragment ShoppingCart_cart on ShoppingCart {
			items(first: 1000) @connection(key: "ShoppingCart_items") {
				edges {
					node {
						id
						amount
						product {
							name
							size
						}
					}
				}
			}
		}
	`,
});
