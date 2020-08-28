import { graphql } from 'react-relay';
import { useMutation } from 'react-relay/hooks';
import { ConnectionHandler } from 'relay-runtime';

import { wishlistAddToWishlistMutation } from './__generated__/wishlistAddToWishlistMutation.graphql';
import { wishlistClearWishlistMutation } from './__generated__/wishlistClearWishlistMutation.graphql';
import { wishlistRemoveFromWishlistMutation } from './__generated__/wishlistRemoveFromWishlistMutation.graphql';

const WISHLIST_ADD_TO_WISHLIST_MUTATION = graphql`
	mutation wishlistAddToWishlistMutation($productId: ID!) {
		addProductToWishlist(input: { product: { id: $productId } }) {
			productEdge {
				node {
					inWishlist
				}
				cursor
			}
		}
	}
`;

export const useAddToWishlistMutation = () => {
	const [commitAddToWishlist, pending] = useMutation<wishlistAddToWishlistMutation>(WISHLIST_ADD_TO_WISHLIST_MUTATION);

	return {
		commit: (productId: string) => {
			commitAddToWishlist({
				variables: {
					productId,
				},
				updater: storeProxy => {
					const productRecord = storeProxy.get(productId);
					if (productRecord) {
						productRecord.setValue(true, 'inWishlist');
					}

					const newEdge = storeProxy.getRootField('addProductToWishlist')?.getLinkedRecord('productEdge') || null;
					const rootProxy = storeProxy.getRoot();
					const wishlistProxy = rootProxy.getLinkedRecord('wishlist');
					if (wishlistProxy) {
						const connection = ConnectionHandler.getConnection(wishlistProxy, 'Wishlist_products');
						if (connection && newEdge) {
							ConnectionHandler.insertEdgeAfter(connection, newEdge);
						}
					}
				},
			});
		},
		pending,
	};
};

const WISHLIST_REMOVE_FROM_WISHLIST_MUTATION = graphql`
	mutation wishlistRemoveFromWishlistMutation($productId: ID!) {
		removeProductFromWishlist(input: { product: { id: $productId } }) {
			productEdge {
				node {
					inWishlist
				}
				cursor
			}
		}
	}
`;

export const useRemoveFromWishlistMutation = () => {
	const [commitRemoveFromWishlist, pending] = useMutation<wishlistRemoveFromWishlistMutation>(
		WISHLIST_REMOVE_FROM_WISHLIST_MUTATION,
	);

	return {
		commit: (productId: string) => {
			commitRemoveFromWishlist({
				variables: {
					productId,
				},
				updater: storeProxy => {
					const productRecord = storeProxy.get(productId);
					if (productRecord) {
						productRecord.setValue(false, 'inWishlist');
					}

					const rootProxy = storeProxy.getRoot();
					const wishlistProxy = rootProxy.getLinkedRecord('wishlist');
					if (wishlistProxy) {
						const connection = ConnectionHandler.getConnection(wishlistProxy, 'Wishlist_products');
						if (connection) {
							ConnectionHandler.deleteNode(connection, productId);
						}
					}
				},
			});
		},
		pending,
	};
};

const CLEAR_WISHLIST_MUTATION = graphql`
	mutation wishlistClearWishlistMutation {
		clearWishlist
	}
`;

export const useClearWishlistMutation = () => {
	const [commitClearWishlist, pending] = useMutation<wishlistClearWishlistMutation>(CLEAR_WISHLIST_MUTATION);

	return {
		commit: () => {
			commitClearWishlist({
				variables: {},
				updater: storeProxy => {
					const rootProxy = storeProxy.getRoot();
					const wishlistProxy = rootProxy.getLinkedRecord('wishlist');
					if (wishlistProxy) {
						const connection = ConnectionHandler.getConnection(wishlistProxy, 'Wishlist_products');
						if (connection) {
							const productIdsInConnection =
								connection.getLinkedRecords('edges')?.map(edge => edge.getLinkedRecord('node')?.getValue('id')) || [];

							productIdsInConnection.forEach(id => {
								if (typeof id === 'string') {
									ConnectionHandler.deleteNode(connection, id);
									const productRecord = storeProxy.get(id);
									if (productRecord) {
										productRecord.setValue(false, 'inWishlist');
									}
								}
							});
						}
					}
				},
			});
		},
		pending,
	};
};
