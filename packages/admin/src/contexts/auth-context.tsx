import React, { createContext, useContext } from 'react';

import { createFragmentContainer, graphql } from 'react-relay';

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
	return <AuthContext.Provider value={{ isAuthenticated: viewer.user !== null }}>{children}</AuthContext.Provider>;
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
