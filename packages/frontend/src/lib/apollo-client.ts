import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

let apolloClient: ApolloClient<any> | null = null;

function createApolloClient(initialState: NormalizedCacheObject) {
	const isServer = typeof window === 'undefined';
	return new ApolloClient({
		ssrMode: isServer,
		link: new HttpLink({
			uri: isServer ? 'http://backend:3000/graphql' : 'http://localhost:8080/graphql',
			credentials: 'same-origin',
		}),
		cache: new InMemoryCache().restore(initialState),
	});
}

export function initializeApollo(initialState: NormalizedCacheObject) {
	const _apolloClient = apolloClient ?? createApolloClient(initialState);

	// For SSR always create a new Apollo Client
	if (typeof window === 'undefined') {
		return _apolloClient;
	}

	// Create the Apollo Client once in the client
	if (!apolloClient) {
		apolloClient = _apolloClient;
	}

	return _apolloClient;
}
