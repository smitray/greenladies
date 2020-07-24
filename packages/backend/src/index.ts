import 'dotenv/config';
import 'reflect-metadata';

import express from 'express';

import { createApolloServer } from './create-apollo-server';

(async function () {
	const app = express();

	app.use((req, _res, next) => {
		console.log(req.body, req.query, req.headers);
		next();
	});

	const server = await createApolloServer();
	server.applyMiddleware({
		app,
	});

	app.listen(3000, () => {
		console.log('Server running');
	});
})();
