import React, { createContext, useContext, useState } from 'react';

interface ShoppingCartModalContextState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

const ShoppingCartModalContext = createContext<ShoppingCartModalContextState>({
	isOpen: false,
	open: () => {
		throw new Error('Not implemented yet!');
	},
	close: () => {
		throw new Error('Not implemented yet!');
	},
});

export const ShoppingCartModalProvider = ({ children }: React.PropsWithChildren<any>) => {
	const [isOpen, setIsOpen] = useState(false);

	const open = () => setIsOpen(true);

	const close = () => setIsOpen(false);

	return (
		<ShoppingCartModalContext.Provider value={{ isOpen, open, close }}>{children}</ShoppingCartModalContext.Provider>
	);
};

export const useShoppingCartModal = () => {
	return useContext(ShoppingCartModalContext);
};
