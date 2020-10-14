import { graphql } from 'react-relay';
import { useMutation } from 'react-relay/hooks';

import { authLoginMutation } from './__generated__/authLoginMutation.graphql';
import { authLogoutMutation } from './__generated__/authLogoutMutation.graphql';

const LOGIN = graphql`
	mutation authLoginMutation($input: LoginInput!) {
		login(input: $input) {
			user {
				id
			}
		}
	}
`;

export const useLoginMutation = () => {
	const [commitLogin, pending] = useMutation<authLoginMutation>(LOGIN);

	return { commit: commitLogin, pending };
};

const LOGOUT = graphql`
	mutation authLogoutMutation {
		logout {
			success
		}
	}
`;

export const useLogoutMutation = () => {
	const [commitLogout, pending] = useMutation<authLogoutMutation>(LOGOUT);

	return { commit: commitLogout, pending };
};
