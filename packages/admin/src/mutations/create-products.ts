import { graphql } from 'react-relay';
import { useMutation } from 'react-relay/hooks';

import { createProductsMutation } from './__generated__/createProductsMutation.graphql';

const CREATE_PRODUCTS = graphql`
	mutation createProductsMutation($input: CreateProductsInput!) {
		createProducts(input: $input) {
			success
		}
	}
`;

export const useCreateProductsMutation = () => {
	const [commitCreateProducts, pending] = useMutation<createProductsMutation>(CREATE_PRODUCTS);

	return { commit: commitCreateProducts, pending };
};
