import empty from 'is-empty';
import Redis from 'ioredis';
import redis from './configs/redis';
import hash from 'object-hash';
/**
 * Redis api cache
 *
 */

/**
 * ApiCache class
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
     * @param params
     * @returns {Promise<T>|Promise}
     */
    async get(params) {
        let key = ApiCache.getHash(params);
        return new Promise((resolve, reject) => {
            this.redis.get(key).then(result => {
                resolve(JSON.parse(result));
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
    async set(params, data, salt = undefined) {
        if (empty(params.user) === false) {
            let key = ApiCache.getHash(params);
            await this.redis.set(key, JSON.stringify(data));
            return true;
        }
        return false;
    }

    /**
     *
     * @param username
     * @param tweet
     * @returns {boolean}
     */
    async setFirstTweet(username, tweet) {
        if (empty(username) === false && empty(tweet) === false) {
            await this.redis.set(username, JSON.stringify(tweet));
            return true;
        }
        return false;
    }

    /**
     *
     * @param username
     * @returns {Promise<T>|Promise}
     */
    async getFirstTweet(username) {
        return new Promise((resolve, reject) => {
            if (empty(username) === true) {
                reject({});
            }
            this.redis.get(username).then(result => {
                resolve(JSON.parse(result));
            }, error => {
                reject({});
            });
        });
    }

    /**
     *
     * @param username
     * @param count
     * @returns {boolean}
     */
    async setUserView(username, count) {
        if (empty(username) === false && empty(count) === false) {
            await this.redis.set(`view-${username}`, count);
            return true;
        }
        return false;
    }

    /**
     *
     * @param username
     * @returns {Promise<T>|Promise}
     */
    async getUserViews(username) {
        return new Promise((resolve, reject) => {
            if (empty(username) === true) {
                reject({});
            }
            this.redis.get(`view-${username}`).then(result => {
                resolve(result);
            }, error => {
                reject({});
            });
        });
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
}
