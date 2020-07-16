import express  from 'express';
import { createServerRelayEnvironment } from './relay-environment';
import { App } from './components/App';
import {renderToString} from 'react-dom/server';
import {RecordSource,Store,Environment,Network} from 'relay-runtime';
import React from 'react';

import {GraphQLResponse} from 'relay-runtime';

const app = express();

app.get('/', async (_req,res) => {
  const {environment,relaySSRMiddleware} = createServerRelayEnvironment();
  renderToString(<App environment={environment} />);
  const relayData = await relaySSRMiddleware.getCache();

  const source = new RecordSource();
  const store = new Store(source);
  const html = renderToString(
    <App
      environment={new Environment({
        network: Network.create(() => {
          const payload = relayData[0][1];
          if (!payload.data) {
            throw new Error("No data");
          }

          const response: GraphQLResponse = {
            data: payload.data,
            errors: payload.errors,
          }

          return response;
        }),
        store
      })} />
  );

  res.send(`
<html>
  <head>
    <title>Green Ladies</title>
  </head>
  <body>
    <div id="root>${html}</div>
    <script>
      window.__RELAY_BOOTSTRAP_DATA__ = ${JSON.stringify(relayData)};
    </script>
    <script src="/assets/bundle.js" />
</html>
  `);
})

export default app;
