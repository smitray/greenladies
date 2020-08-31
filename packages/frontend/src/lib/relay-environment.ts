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

function fetchQueryServer(cookieHeader?: string) {
	return async function (operation: RequestParameters, variables: Variables) {
		const response = await fetch('http://backend:3000/api/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				cookie: cookieHeader || '',
			},
			body: JSON.stringify({
				query: operation.text,
				variables,
			}),
		});
		return response.json();
	};
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

	const response = await fetch('/api/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: process.env.NODE_ENV === 'development' ? 'include' : 'same-origin',
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

export function createRelayEnvironment(records?: RecordMap, cookieHeader?: string) {
	if (relayEnvironment) {
		return relayEnvironment;
	}

	if (!store) {
		const source = new RecordSource(records);
		store = new Store(source);
	}

	relayEnvironment = new Environment({
		store,
		network: Network.create(typeof window === 'undefined' ? fetchQueryServer(cookieHeader) : fetchQueryClient),
	});

	return relayEnvironment;
}
