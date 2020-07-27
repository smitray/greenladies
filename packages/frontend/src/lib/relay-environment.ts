import { Environment, Network, RecordSource, RequestParameters, Store, Variables } from 'relay-runtime';
import { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

async function fetchQuery(operation: RequestParameters, variables: Variables) {
	let url: string;
	if (typeof window === 'undefined') {
		url = 'http://backend:3000/graphql';
	} else {
		url = String(process.env.GRAPHQL_API_ENDPOINT);
	}

	const response = await fetch(url, {
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

let relayEnvironment: Environment | null = null;
let store: Store | null = null;

export function initRelayEnvironment() {
	if (typeof window !== 'undefined') {
		throw new Error('This function should only be called on the server');
	}

	const source = new RecordSource();
	const store = new Store(source);

	return new Environment({
		store,
		network: Network.create(fetchQuery),
	});
}

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
		network: Network.create(fetchQuery),
	});

	return relayEnvironment;
}
