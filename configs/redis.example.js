/**
 * My local settings redis
 * rename redis.example.js -> redis.js
 */
import Redis from 'ioredis';
const redis = new Redis(32775, '192.168.99.100');
export default redis;