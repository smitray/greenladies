import { graphql } from 'react-relay';
import { useMutation } from 'react-relay/hooks';
import { ConnectionHandler } from 'relay-runtime';

import { shoppingCartAddCouponToCartMutation } from './__generated__/shoppingCartAddCouponToCartMutation.graphql';
import { shoppingCartAddProductToCartMutation } from './__generated__/shoppingCartAddProductToCartMutation.graphql';
import { shoppingCartRemoveProductFromCartMutation } from './__generated__/shoppingCartRemoveProductFromCartMutation.graphql';
import { shoppingCartUpdateCartAmountMutation } from './__generated__/shoppingCartUpdateCartAmountMutation.graphql';

const ADD_PRODUCT_TO_CART = graphql`
	mutation shoppingCartAddProductToCartMutation($productId: ID!) {
		addProductToCart(input: { product: { id: $productId }, quantity: 1 }) {
			cart {
				id
				grandTotal
				subTotal
				discountAmount
				shippingCost
			}
			shoppingCartItemEdge {
				node {
					id
					amount
					product {
						id
						name
						parent {
							id
						}
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
							const totalCount = connection.getValue('totalCount');
							if (typeof totalCount === 'number') {
								connection.setValue(totalCount + 1, 'totalCount');
							}

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
			cart {
				id
				grandTotal
				subTotal
				discountAmount
				shippingCost
			}
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
			cart {
				id
				grandTotal
				subTotal
				discountAmount
				shippingCost
			}
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
								const totalCount = connection.getValue('totalCount');
								if (typeof totalCount === 'number') {
									connection.setValue(totalCount - 1, 'totalCount');
								}

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

const ADD_COUPON_TO_CART = graphql`
	mutation shoppingCartAddCouponToCartMutation($coupon: String!) {
		addCouponToCart(input: { code: $coupon }) {
			cart {
				id
				grandTotal
				subTotal
				discountAmount
				shippingCost
			}
		}
	}
`;

export const useAddCouponToCartMutation = () => {
	const [commitAddCoupon, pending] = useMutation<shoppingCartAddCouponToCartMutation>(ADD_COUPON_TO_CART);

	return {
		commit: (coupon: string) => {
			return new Promise((resolve, reject) =>
				commitAddCoupon({
					variables: {
						coupon,
					},
					onCompleted: () => resolve(),
					onError: () => reject(),
				}),
			);
		},
		pending,
	};
};
