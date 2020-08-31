declare global {
	namespace Express {
		interface Session {
			guestShoppingCart?: {
				cartId: string;
				klarna?: {
					orderId: string;
					cartSnippet: string;
					confirmSnippet?: string;
				};
			};
			wishlist?: string[];
		}
	}
}

export const nothing = 0;
