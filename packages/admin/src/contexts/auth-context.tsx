import React, { createContext, useContext } from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

import { useLoginMutation, useLogoutMutation } from '../mutations/auth';

import { authContext_viewer } from './__generated__/authContext_viewer.graphql';

interface AuthContextState {
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextState>({
	isAuthenticated: false,
	login: () => {
		throw new Error('Not implemented');
	},
	logout: () => {
		throw new Error('Not implemented');
	},
});

interface AuthProviderInternalProps {
	viewer: authContext_viewer;
}

const AuthProviderInternal = ({ viewer, children }: React.PropsWithChildren<AuthProviderInternalProps>) => {
	const { commit: login } = useLoginMutation();
	const { commit: logout } = useLogoutMutation();
	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: viewer.user !== null,
				login: (username: string, password: string) => {
					return new Promise((resolve, reject) => {
						login({
							variables: {
								input: {
									username,
									password,
								},
							},
							onCompleted: () => {
								resolve();
							},
							onError: () => {
								reject();
							},
							updater: proxy => {
								const user = proxy.getRootField('login')?.getLinkedRecord('user');
								const viewer = proxy.getRoot().getLinkedRecord('viewer');
								if (viewer && user) {
									viewer.setLinkedRecord(user, 'user');
								}
							},
						});
					});
				},
				logout: () => {
					return new Promise((resolve, reject) => {
						logout({
							variables: {},
							onCompleted: () => {
								resolve();
							},
							onError: () => {
								reject();
							},
							updater: proxy => {
								const viewer = proxy.getRoot().getLinkedRecord('viewer');
								if (viewer) {
									viewer.setLinkedRecord(null, 'user');
								}
							},
						});
					});
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const AuthProvider = createFragmentContainer(AuthProviderInternal, {
	viewer: graphql`
		fragment authContext_viewer on Viewer {
			user {
				id
			}
		}
	`,
});

export const useAuth = () => {
	return useContext(AuthContext);
};
