import redis from 'redis';

export const redisCacheConnection = redis.createClient({ host: 'redis-cache' });
