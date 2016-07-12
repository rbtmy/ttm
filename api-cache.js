import empty from 'is-empty';
import Redis from 'ioredis';
import redis from './configs/redis';
import hash from 'object-hash';
/**
 * Redis api cache
 *
 */

export default class ApiCache {

    /**
     *
     */
    constructor() {
        this.redis = redis;
    }

    /**
     *
     * @param queries
     * @param twitterUser
     * @returns {*}
     */
    async get(queries, twitterUser) {
        await this.redis.get(ApiCache.createKey(queries, twitterUser)).then(result => {
            return result;
        });
    }

    /**
     *
     * @param queries
     * @param twitterUser
     * @param data
     */
    async set(queries, twitterUser, data) {
        await this.redis.set(ApiCache.createKey(queries, twitterUser), JSON.stringify(data));
    }

    /**
     *
     * @param queries
     * @param twitterUser
     * @returns {*}
     */
    async destroy(queries, twitterUser) {
        return await this.redis.del(ApiCache.createKey(queries, twitterUser));
    }

    /**
     *
     * @param queries
     * @param twitterUser
     * @returns {*}
     */
    static createKey(queries, twitterUser) {
        return `${queries}-${twitterUser}`;
    }
}
