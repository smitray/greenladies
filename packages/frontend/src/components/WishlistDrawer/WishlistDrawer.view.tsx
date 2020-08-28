import React from 'react';

import Drawer from 'rc-drawer';
import { createFragmentContainer, graphql } from 'react-relay';

import { useRemoveFromWishlistMutation } from '../../mutations/wishlist';

import { WishlistDrawer_wishlist } from './__generated__/WishlistDrawer_wishlist.graphql';

interface WishlistDrawerViewProps {
	wishlist: WishlistDrawer_wishlist;
	open: boolean;
	onCloseRequest: () => void;
}

const WishlistDrawerView = ({ wishlist, open, onCloseRequest }: WishlistDrawerViewProps) => {
	const { commit: removeFromWishlist } = useRemoveFromWishlistMutation();

	return (
		<Drawer open={open} placement="right" handler={false} width={300} onClose={onCloseRequest}>
			<div>
				{wishlist.products.totalCount === 0 && <div>There are no items in your wishlist</div>}
				{wishlist.products.edges.length > 0 &&
					wishlist.products.edges.map(({ node: product }) => (
						<div key={product.id}>
							{product.name}
							<button onClick={() => removeFromWishlist(product.id)}>REMOVE</button>
						</div>
					))}
			</div>
		</Drawer>
	);
};

export default createFragmentContainer(WishlistDrawerView, {
	wishlist: graphql`
		fragment WishlistDrawer_wishlist on Wishlist {
			products(first: 10000) @connection(key: "Wishlist_products") {
				edges {
					node {
						id
						name
					}
				}
				totalCount
			}
		}
	`,
});
