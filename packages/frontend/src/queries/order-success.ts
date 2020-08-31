import { graphql } from 'relay-runtime';

import { orderSuccessQuery } from './__generated__/orderSuccessQuery.graphql';

export const ORDER_SUCCESS_QUERY = graphql`
	query orderSuccessQuery($orderId: ID!) {
		klarnaOrderConfirmationSnippet(orderId: $orderId)
	}
`;

export type { orderSuccessQuery as OrderSuccessQuery };
