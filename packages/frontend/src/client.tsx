import { createClientRelayEnvironment } from "./relay-environment";
import ReactDOM from 'react-dom';
import React from 'react';
import { App } from "./components/App";

const environment = createClientRelayEnvironment((window as any).__RELAY_BOOTSTRAP_DATA__);

ReactDOM.hydrate(<App environment={environment} />, document.getElementById('root'));

if((module as any).hot) {
  (module as any).hot.accept();
}