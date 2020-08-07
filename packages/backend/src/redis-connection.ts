import redis from 'redis';

let redisCacheConnection: redis.RedisClient | null = null;

export const getRedisCacheConnection = () => {
	if (redisCacheConnection !== null) {
		return redisCacheConnection;
	}

	redisCacheConnection = redis.createClient({ host: 'redis-cache' });
	return redisCacheConnection;
};
