import express from 'express';

import { createApolloServer } from './create-apollo-server';

(async function () {
	const app = express();

	const server = await createApolloServer();
	server.applyMiddleware({
		app,
	});

	app.listen(3000, () => {
		console.log('Server running');
	});
})();
