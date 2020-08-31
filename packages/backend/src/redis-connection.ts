import redis from 'redis';

let redisCacheConnection: redis.RedisClient | null = null;

export const getRedisCacheConnection = () => {
	if (redisCacheConnection !== null) {
		return redisCacheConnection;
	}

	redisCacheConnection = redis.createClient({ host: 'redis-cache' });
	return redisCacheConnection;
};

export function getRedisCache() {
	if (redisCacheConnection === null) {
		redisCacheConnection = redis.createClient({ host: 'redis-cache' });
	}

	return {
		get: function <T = any>(key: string): Promise<T> {
			return new Promise((resolve, reject) => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				redisCacheConnection!.get(key, (err, value) => {
					if (err) {
						return reject(err);
					}

					if (value === null) {
						return reject(new Error('Not found: ' + key));
					}

					return resolve(JSON.parse(value) as T);
				});
			});
		},
		set: function <T = any>(key: string, value: T, expiresInSeconds?: number): Promise<void> {
			return new Promise((resolve, reject) => {
				if (expiresInSeconds !== undefined) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					redisCacheConnection!.setex(key, expiresInSeconds, JSON.stringify(value), err => {
						if (err) {
							return reject(err);
						}

						return resolve();
					});
				} else {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					redisCacheConnection!.set(key, JSON.stringify(value), err => {
						if (err) {
							return reject(err);
						}

						return resolve();
					});
				}
			});
		},
		getMany: function <T = any>(keys: string[]): Promise<T[]> {
			return new Promise((resolve, reject) => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				redisCacheConnection!.mget(keys, (err, values) => {
					if (err) {
						return reject(err);
					}

					return resolve(values.map(value => JSON.parse(value) as T));
				});
			});
		},
		setMany: async function <T = any>(pairs: { key: string; value: T; expiresInSeconds?: number }[]): Promise<void> {
			await new Promise((resolve, reject) => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				redisCacheConnection!.mset(
					pairs.reduce<string[]>((prev, current) => {
						return prev.concat(current.key, JSON.stringify(current.value));
					}, []),
					(err, result) => {
						if (err) {
							return reject(err);
						}

						if (!result) {
							return reject(new Error('Something went wrong'));
						}

						return resolve();
					},
				);
			});
			await Promise.all(
				pairs
					.filter(pair => pair.expiresInSeconds !== undefined)
					.map(
						pair =>
							new Promise((resolve, reject) => {
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								redisCacheConnection!.expire(pair.key, pair.expiresInSeconds!, (err, res) => {
									if (err) {
										reject(err);
									}

									if (res === 0) {
										reject(new Error('Key does not exist'));
									}

									resolve();
								});
							}),
					),
			);
		},
	};
}
