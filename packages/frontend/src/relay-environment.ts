import RelayServerSSR, {SSRCache} from 'react-relay-network-modern-ssr/lib/server';
import RelayClientSSR from 'react-relay-network-modern-ssr/lib/client';
import {RelayNetworkLayer, urlMiddleware} from 'react-relay-network-modern'
import {RecordSource, Store, Environment} from 'relay-runtime';

export function createServerRelayEnvironment() {
  const relaySSRMiddleware = new RelayServerSSR();

  relaySSRMiddleware.debug = process.env.NODE_ENV === 'development';

  const network = new RelayNetworkLayer([
    relaySSRMiddleware.getMiddleware(),
    urlMiddleware({
      url: 'http://backend:3000/graphql'
    })
  ]);

  const source = new RecordSource();
  const store = new Store(source);
  const environment = new Environment({
    network,
    store
  })

  return {environment, relaySSRMiddleware};

}

export function createClientRelayEnvironment(cache: SSRCache) {
  const relaySSRMiddleware = new RelayClientSSR(cache);

  relaySSRMiddleware.debug = process.env.NODE_ENV === 'development';

  const network = new RelayNetworkLayer([
    relaySSRMiddleware.getMiddleware(),
    urlMiddleware({
      url: String(process.env.GRAPHQL_ENDPOINT)
    })
  ]);

  const source = new RecordSource();
  const store = new Store(source);
  const environment = new Environment({
    network,
    store
  })

  return environment;
}