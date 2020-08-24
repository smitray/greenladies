declare global {
	namespace Express {
		interface Session {
			guestShoppingCart?: {
				cartId: string;
				klarnaCartSnippet?: string;
			};
			wishlist?: string[];
		}
	}
}

export const nothing = 0;
