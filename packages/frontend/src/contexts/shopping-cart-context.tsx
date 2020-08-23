import React, { createContext, useContext, useState } from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { ShoppingCart } from '../components/ShoppingCart';

import { shoppingCartContext_cart } from './__generated__/shoppingCartContext_cart.graphql';

interface ShoppingCartContextState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextState>({
	isOpen: false,
	open: () => {
		throw new Error('Not implemented');
	},
	close: () => {
		throw new Error('Not implemented');
	},
});

interface ShoppingCartProviderProps {
	cart: shoppingCartContext_cart;
}

function ShoppingCartProviderInternal({ cart, children }: React.PropsWithChildren<ShoppingCartProviderProps>) {
	const [isOpen, setIsOpen] = useState(false);

	const open = () => {
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
	};

	return (
		<ShoppingCartContext.Provider value={{ isOpen, open, close }}>
			<button onClick={() => setIsOpen(open => !open)}>CART</button>
			{children}
			<ShoppingCart open={isOpen} onCloseRequest={close} cart={cart} />
		</ShoppingCartContext.Provider>
	);
}

export const ShoppingCartProvider = createFragmentContainer(ShoppingCartProviderInternal, {
	cart: graphql`
		fragment shoppingCartContext_cart on ShoppingCart {
			...ShoppingCart_cart
		}
	`,
});

export function useShoppingCart() {
	return useContext(ShoppingCartContext);
}
