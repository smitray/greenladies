import React, { createContext, useContext } from 'react';

import {
	CacheConfig,
	Environment,
	Network,
	QueryResponseCache,
	RecordSource,
	RequestParameters,
	Store,
	Variables,
} from 'relay-runtime';
import { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

async function fetchQueryServer(operation: RequestParameters, variables: Variables) {
	const response = await fetch('http://backend:3000/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: operation.text,
			variables,
		}),
	});
	return response.json();
}

const FIVE_MINUTES = 60 * 1000;
const cache = new QueryResponseCache({ size: 500, ttl: FIVE_MINUTES });

async function fetchQueryClient(operation: RequestParameters, variables: Variables, cacheConfig: CacheConfig) {
	const queryID = operation.text;
	const isMutation = operation.operationKind === 'mutation';
	const isQuery = operation.operationKind === 'query';
	const forceFetch = cacheConfig && cacheConfig.force;

	if (!queryID) {
		throw new Error('queryID must not be null or undefined');
	}

	// Try to get data from cache on queries
	const fromCache = cache.get(queryID, variables);
	if (isQuery && fromCache !== null && !forceFetch) {
		return fromCache;
	}

	const response = await fetch(String(process.env.GRAPHQL_API_ENDPOINT), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: operation.text,
			variables,
		}),
	});
	const json = await response.json();

	if (isQuery && json) {
		cache.set(queryID, variables, json);
	}
	// Clear cache on mutations
	if (isMutation) {
		cache.clear();
	}

	return json;
}

let relayEnvironment: Environment | null = null;
let store: Store | null = null;

export function createRelayEnvironment(records?: RecordMap) {
	if (relayEnvironment) {
		return relayEnvironment;
	}

	if (!store) {
		const source = new RecordSource(records);
		store = new Store(source);
	}

	relayEnvironment = new Environment({
		store,
		network: Network.create(typeof window === 'undefined' ? fetchQueryServer : fetchQueryClient),
	});

	return relayEnvironment;
}

interface RelayContextValue {
	getEnvironment: () => Environment;
}

const RelayContext = createContext<RelayContextValue>({
	getEnvironment: () => {
		throw new Error('No provider was provided');
	},
});

interface RelayProviderProps {
	environment: Environment;
}

export const RelayProvider: React.FC<RelayProviderProps> = ({ children, environment }) => {
	return <RelayContext.Provider value={{ getEnvironment: () => environment }}>{children}</RelayContext.Provider>;
};

export const useRelayEnvironment = () => {
	const { getEnvironment } = useContext(RelayContext);

	return getEnvironment();
};
