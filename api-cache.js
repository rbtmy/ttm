import empty from 'is-empty';

/**
 * Redis api cache
 *
 */

class ApiCache {

    /**
     *
     */
    constructor() {
        this.redis = new Redis();
    }

    /*8

     */
    async get(queries, twitterUser) {
        return await this.redis.get(ApiCache.createKey(queries, twitterUser));
    }

    /**
     *
     * @param queries
     * @param twitterUser
     * @param data
     */
    async set(queries, twitterUser, data) {
        if (empty(this.get(this.createKey(queries, twitterUser)))) {
            await this.redis.add(ApiCache.createKey(queries, twitterUser), data);
        }
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
