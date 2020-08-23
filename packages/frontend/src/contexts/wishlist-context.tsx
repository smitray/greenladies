import React, { createContext, useContext, useState } from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { Wishlist } from '../components/Wishlist';

import { wishlistContext_wishlist } from './__generated__/wishlistContext_wishlist.graphql';

interface WishlistContextState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

const WishlistContext = createContext<WishlistContextState>({
	isOpen: false,
	open: () => {
		throw new Error('Not implemented');
	},
	close: () => {
		throw new Error('Not implemented');
	},
});

interface WishlistProviderProps {
	wishlist: wishlistContext_wishlist;
}

function WishlistProviderInternal({ wishlist, children }: React.PropsWithChildren<WishlistProviderProps>) {
	const [isOpen, setIsOpen] = useState(false);

	const open = () => {
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
	};

	return (
		<WishlistContext.Provider value={{ isOpen, open, close }}>
			{children}
			<Wishlist open={isOpen} onCloseRequest={close} wishlist={wishlist} />
		</WishlistContext.Provider>
	);
}

export const WishlistProvider = createFragmentContainer(WishlistProviderInternal, {
	wishlist: graphql`
		fragment wishlistContext_wishlist on Wishlist {
			...Wishlist_wishlist
		}
	`,
});

export function useWishlist() {
	return useContext(WishlistContext);
}
