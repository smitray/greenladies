import { OrderModuleResolversType } from '..';
import { OrderProvider } from '../order.provider';

const resolvers: OrderModuleResolversType = {
	Query: {
		klarnaOrderConfirmationSnippet: (_parent, { orderId }, { injector }) => {
			return injector.get(OrderProvider).getKlarnaOrderConfirmationSnippet(orderId);
		},
	},
};

export default resolvers;
