import React from 'react';

import Drawer from 'rc-drawer';
import { createFragmentContainer, graphql } from 'react-relay';

import { useRemoveFromCartMutation } from '../../mutations/shopping-cart';

import { ShoppingCartDrawer_cart } from './__generated__/ShoppingCartDrawer_cart.graphql';

interface ShoppingCartDrawerView {
	cart: ShoppingCartDrawer_cart;
	open: boolean;
	onCloseRequest: () => void;
}

export const ShoppingCartDrawerView = ({ cart, open, onCloseRequest }: ShoppingCartDrawerView) => {
	const { commit: removeFromCart } = useRemoveFromCartMutation();

	return (
		<Drawer open={open} placement="right" handler={false} width={300} onClose={onCloseRequest}>
			<div>
				{cart.items.totalCount === 0 && <div>Your cart is empty</div>}
				{cart.items.edges.length > 0 &&
					cart.items.edges.map(({ node: item }) => (
						<div key={item.id}>
							{item.product.name} ({item.product.size}) [{item.amount}]
							<button onClick={() => removeFromCart(item.id)}>REMOVE</button>
						</div>
					))}
			</div>
		</Drawer>
	);
};

export default createFragmentContainer(ShoppingCartDrawerView, {
	cart: graphql`
		fragment ShoppingCartDrawer_cart on ShoppingCart {
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
				totalCount
			}
		}
	`,
});
