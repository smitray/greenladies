import { graphql } from 'react-relay';
import { useMutation } from 'react-relay/hooks';
import { ConnectionHandler } from 'relay-runtime';

import { shoppingCartAddProductToCartMutation } from './__generated__/shoppingCartAddProductToCartMutation.graphql';
import { shoppingCartRemoveProductFromCartMutation } from './__generated__/shoppingCartRemoveProductFromCartMutation.graphql';
import { shoppingCartUpdateCartAmountMutation } from './__generated__/shoppingCartUpdateCartAmountMutation.graphql';

const ADD_PRODUCT_TO_CART = graphql`
	mutation shoppingCartAddProductToCartMutation($productId: ID!) {
		addProductToCart(input: { product: { id: $productId }, quantity: 1 }) {
			shoppingCartItemEdge {
				node {
					id
					amount
					product {
						name
					}
				}
				cursor
			}
		}
	}
`;

export const useAddToCartMutation = () => {
	const [commitAddToCart, pending] = useMutation<shoppingCartAddProductToCartMutation>(ADD_PRODUCT_TO_CART);

	return {
		commit: (productId: string) => {
			commitAddToCart({
				variables: {
					productId,
				},
				updater: storeProxy => {
					const newEdge = storeProxy.getRootField('addProductToCart')?.getLinkedRecord('shoppingCartItemEdge') || null;
					const cartProxy = storeProxy.getRoot().getLinkedRecord('shoppingCart');
					if (cartProxy && newEdge) {
						const connection = ConnectionHandler.getConnection(cartProxy, 'ShoppingCart_items');
						if (connection) {
							const connectionEdges = connection.getLinkedRecords('edges');
							const itemInCart =
								connectionEdges?.findIndex(
									connectionEdge =>
										connectionEdge.getLinkedRecord('node')?.getLinkedRecord('product')?.getValue('id') === productId,
								) !== -1;
							if (!itemInCart) {
								ConnectionHandler.insertEdgeAfter(connection, newEdge);
							}
						}
					}
				},
			});
		},
		pending,
	};
};

const UPDATE_CART_AMOUNT = graphql`
	mutation shoppingCartUpdateCartAmountMutation($itemId: ID!, $quantity: Int!) {
		updateProductAmountInCart(input: { itemId: $itemId, quantity: $quantity }) {
			shoppingCartItemEdge {
				node {
					id
					amount
				}
				cursor
			}
		}
	}
`;

export const useUpdateCartAmountMutation = () => {
	const [commitUpdateCartAmount, pending] = useMutation<shoppingCartUpdateCartAmountMutation>(UPDATE_CART_AMOUNT);

	return {
		commit: (itemId: string, quantity: number) => {
			commitUpdateCartAmount({
				variables: {
					itemId,
					quantity,
				},
			});
		},
		pending,
	};
};

const REMOVE_PRODUCT_FROM_CART = graphql`
	mutation shoppingCartRemoveProductFromCartMutation($itemId: ID!) {
		removeProductFromCart(input: { itemId: $itemId }) {
			success
		}
	}
`;

export const useRemoveFromCartMutation = () => {
	const [commitRemoveFromCart, pending] = useMutation<shoppingCartRemoveProductFromCartMutation>(
		REMOVE_PRODUCT_FROM_CART,
	);

	return {
		commit: (itemId: string) => {
			return new Promise((resolve, reject) =>
				commitRemoveFromCart({
					variables: {
						itemId,
					},
					updater: storeProxy => {
						const rootProxy = storeProxy.getRoot();
						const cartProxy = rootProxy.getLinkedRecord('shoppingCart');
						if (cartProxy) {
							const connection = ConnectionHandler.getConnection(cartProxy, 'ShoppingCart_items');
							if (connection) {
								ConnectionHandler.deleteNode(connection, itemId);
							}
						}
					},
					onCompleted: () => {
						resolve();
					},
					onError: () => {
						reject();
					},
				}),
			);
		},
		pending,
	};
};
