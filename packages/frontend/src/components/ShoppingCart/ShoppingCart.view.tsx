import React, { useMemo } from 'react';

import Drawer from 'rc-drawer';
import { createFragmentContainer, graphql } from 'react-relay';

import { ShoppingCart_cart } from './__generated__/ShoppingCart_cart.graphql';

interface WishlistViewProps {
	cart: ShoppingCart_cart;
	open: boolean;
	onCloseRequest: () => void;
}

const ShoppingCartView = ({ cart, open, onCloseRequest }: WishlistViewProps) => {
	const items = useMemo(() => cart.items.edges.map(edge => edge.node), [cart]);

	return (
		<Drawer open={open} placement="right" handler={false} width={300} onClose={onCloseRequest}>
			<div>
				{items.length === 0 && <div>Your cart is empty</div>}
				{items.length > 0 &&
					items.map(item => (
						<div key={item.id}>
							{item.product.name}
							<button>REMOVE</button>
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
						}
					}
				}
			}
		}
	`,
});
