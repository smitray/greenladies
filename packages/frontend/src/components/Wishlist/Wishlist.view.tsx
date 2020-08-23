import React, { useMemo } from 'react';

import Drawer from 'rc-drawer';
import { createFragmentContainer, graphql } from 'react-relay';

import { useRemoveFromWishlistMutation } from '../../mutations/wishlist';

import { Wishlist_wishlist } from './__generated__/Wishlist_wishlist.graphql';

interface WishlistViewProps {
	wishlist: Wishlist_wishlist;
	open: boolean;
	onCloseRequest: () => void;
}

const WishlistView = ({ wishlist, open, onCloseRequest }: WishlistViewProps) => {
	const { commit: removeFromWishlist } = useRemoveFromWishlistMutation();
	const products = useMemo(() => wishlist.products.edges.map(edge => edge.node), [wishlist]);

	return (
		<Drawer open={open} placement="right" handler={false} width={300} onClose={onCloseRequest}>
			<div>
				{products.length === 0 && <div>There are no items in your wishlist</div>}
				{products.length > 0 &&
					products.map(product => (
						<div key={product.id}>
							{product.name}
							<button onClick={() => removeFromWishlist(product.id)}>REMOVE</button>
						</div>
					))}
			</div>
		</Drawer>
	);
};

export default createFragmentContainer(WishlistView, {
	wishlist: graphql`
		fragment Wishlist_wishlist on Wishlist {
			products(first: 10000) @connection(key: "Wishlist_products") {
				edges {
					node {
						id
						name
					}
				}
			}
		}
	`,
});
