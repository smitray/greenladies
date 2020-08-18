declare global {
	namespace Express {
		interface Session {
			guestShoppingCartId?: string;
			wishlist?: string[];
		}
	}
}

export const nothing = 0;
