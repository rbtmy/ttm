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
        this._cachedValue = '';
    }

    /**
     *
     * @param params
     * @returns {Promise<T>|Promise}
     */
    async get(params) {
        let key = ApiCache.getHash(params);
        return new Promise((resolve, reject) => {
            this.redis.get(key).then(result => {
                this._cachedValue = result;
                resolve(result);
            }, error => {
                reject({});
            });
        });
    }

    /**
     *
     * @param params
     * @param data
     * @returns {boolean}
     */
    async set(params, data) {
        if (empty(params.user) === false) {
            let key = ApiCache.getHash(params);
            await this.redis.set(key, JSON.stringify(data));
            return true;
        }
        return false;
    }

    /**
     *
     * @param params
     * @returns {*}
     */
    async destroy(params) {
        let key = ApiCache.getHash(params);
        return await this.redis.del(key);
    }

    /**
     *
     * @param params
     */
    static getHash(params) {
        return hash(params);
    }

    /**
     *
     * @returns {*|string}
     */
    get cachedValue() {
        return this._cachedValue;
    }
}
