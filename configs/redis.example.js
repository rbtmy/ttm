/**
 * My local settings redis
 * rename redis.example.js -> redis.js
 */
import Redis from 'ioredis'
const redisPort = 32776;
const redisHost = '192.168.99.100';
const redis = new Redis(redisPort, redisHost);

function redisInstance() {
    return new Redis(redisPort, redisHost);
}

export {redisInstance}
export {redisPort};
export {redisHost};
export default redis;