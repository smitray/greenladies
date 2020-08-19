import React from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { useRemoveFromWishlistMutation } from '../../mutations/wishlist';

import { Wishlist_wishlist } from './__generated__/Wishlist_wishlist.graphql';

interface WishlistViewProps {
	wishlist: Wishlist_wishlist | null;
}

const WishlistView = ({ wishlist }: WishlistViewProps) => {
	const { commit: removeFromWishlist } = useRemoveFromWishlistMutation();
	return (
		<div>
			{!wishlist && <div>There are no items in your wishlist</div>}
			{wishlist &&
				wishlist.products.edges.map(({ node: product }) => (
					<div key={product.id}>
						{product.name}
						<button onClick={() => removeFromWishlist(product.id)}>REMOVE</button>
					</div>
				))}
		</div>
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
