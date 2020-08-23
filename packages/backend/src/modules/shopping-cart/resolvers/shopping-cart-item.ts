import { ShoppingCartModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';

const resolvers: ShoppingCartModuleResolversType = {
	ShoppingCartItem: {
		id: ({ id }) => {
			return toGlobalId('ShoppingCartItem', id);
		},
		amount: ({ amount }) => {
			return amount;
		},
		product: ({ product }) => {
			return product;
		},
	},
};

export default resolvers;
