import empty from 'is-empty';
import Redis from 'ioredis';
import {redisInstance} from './configs/redis';
import hash from 'object-hash';
import {limitRestriction} from './applications/api/routes/index';

/**
 * ApiCache class
 *
 * Redis api cache
 */
export default class ApiCache {

    /**
     * Methods of caching data API
     */
    constructor() {
        this.redis = redisInstance();
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
     * @param salt
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
     * @param params
     * @returns {*}
     */
    async destroy(params) {
        let key = ApiCache.getHash(params);
        return await this.redis.del(key);
    }

    /**
     *
     * @param username
     * @param tweets
     * @param limit
     * @returns {boolean}
     */
    async setFirstLimitTweet(username, tweets, limit) {
        if (limit === undefined) {
            limit = 1;
        }
        if (empty(username) === false && empty(tweets) === false) {
            for (let i = limit; i > 0; i--) {
                await this.redis.set(`${username}-${i}`, JSON.stringify(tweets.slice(-1 *i)));
            }

            return true;
        }
        return false;
    }

    /**
     *
     * @param username
     */
    async deleteFirstLimitTweets(username) {
        console.log(username);
        if (empty(username) === false) {
            for (let i = 1; i <= limitRestriction; i++) {
                await this.redis.del(`${username}-${i}`);
            }
        }
    }

    /**
     *
     * @param username
     * @param limit
     * @returns {Promise<T>|Promise}
     */
    async getFirstLimitTweets(username, limit) {
        return new Promise((resolve, reject) => {
            if (empty(username) === true) {
                reject({});
            }
            if (limit === undefined) {
                limit = 1;
            }
            this.redis.get(`${username}-${limit}`).then(result => {
                resolve(JSON.parse(result));
            }, error => {
                reject({});
            });
        });
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
     * @returns {*}
     */
    async deleteFirstTweet(username) {
        return await this.redis.del(username);
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
     * @param username
     * @returns {*}
     */
    async deleteUserViews(username) {
        return await this.redis.del(`view-${username}`);
    }

    /**
     *
     * @param params
     */
    static getHash(params) {
        return hash(params);
    }
}
