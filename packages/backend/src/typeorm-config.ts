import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
	type: 'postgres',
	host: String(process.env.PG_HOST),
	port: Number(process.env.PG_PORT),
	database: String(process.env.PG_DATABASE),
	username: String(process.env.PG_USERNAME),
	password: String(process.env.PG_PASSWORD),
	entities: [__dirname + '/entities/*.{js,ts}'],
	synchronize: process.env.NODE_ENV === 'development',
	logging: ['error', 'warn'],
};

export default config;
