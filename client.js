import Tweet from './models/tweet';
import cheerio from 'cheerio';
import request from 'request';
import co from 'co';
import moment from 'moment';
import empty from 'is-empty';

/**
 *
 * @type {string}
 */
const twitterUrl = 'https://twitter.com';

/**
 * Static timeline link
 * @type {string}
 */
const twitterTimeLine = 'https://twitter.com/i/search/timeline';

/**
 * Twitter at
 * @type {number}
 */
const timeLineStartPosition = 2004;

/**
 *
 */
export default class TwitterClient {

    /**
     * 
     * @param user
     */
    constructor(user) {
        this._user =  user;
        this._pointer = '';
        this._tweets = [];
        this._block = false;
        this._firstTweet = {};
        this._yearPointer = 2005;
    }

    /**
     *
     * @returns {boolean}
     */
    isFirstTweet() {
        let result = false;
        if (this._user.count === 3500
            && this._user.since === undefined
            && this._user.until === undefined) {
            this._user.since = moment({ years: timeLineStartPosition }).format('YYYY-MM-DD');
            this._user.until = moment({ years: this._yearPointer }).format('YYYY-MM-DD');
            this._firstTweetFlag = true;
            result = true;
        }
        return result;
    }

    /**
     *
     */
    findFirstTweet() {
        this._yearPointer += 1;
        this._user.until = moment({ years: this._yearPointer }).format('YYYY-MM-DD');
        console.log(this._user.until);
    }

    /**
     *
     * @returns {*}
     */
    getFirstTweet() {
        return this._tweets.pop();
    }

    /**
     *
     * @returns {Promise<T>|Promise}
     */
    async fetchOne() {
        this.isFirstTweet();
        return new Promise((resolve, reject) => {
            try {
                let currentYear = moment().format('YYYY');
                this.clientLoop = setInterval(() => {
                    if (this._pointer === null || this.getTweetsCount() >= this._user.count) {
                        resolve(this._tweets);
                        clearInterval(this.clientLoop);
                    }
                    if (this._block === false) {
                        this.response(this.request(this._pointer)).then(tweets => {
                            if (tweets === false) {
                                if (this._yearPointer > currentYear) {
                                    resolve(this._tweets);
                                    clearInterval(this.clientLoop);
                                } else {
                                    this.findFirstTweet();
                                }
                                this._block = false;
                            } else {
                                if (this._yearPointer > currentYear) {
                                    resolve(this._tweets);
                                    clearInterval(this.clientLoop);
                                }
                                this._tweets = tweets.reduce(function (coll, item) {
                                    coll.push(item);
                                    return coll;
                                }, this._tweets);
                                this._block = false;
                            }
                        }, error => {
                            console.error("Unhandled error", error);
                            clearInterval(this.clientLoop);
                        });
                    }
                }, 10);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     *
     * @returns {Promise<T>|Promise}
     */
    async fetch() {
        return new Promise((resolve, reject) => {
            try {
                this.clientLoop = setInterval(() => {
                    if (this._pointer === null || this.getTweetsCount() >= this._user.count) {
                        resolve(this._tweets);
                        clearInterval(this.clientLoop);
                    }
                    if (this._block === false) {
                        this.response(this.request(this._pointer)).then(tweets => {
                            if (tweets === false) {
                                resolve(this._tweets);
                                clearInterval(this.clientLoop);
                            }
                            this._tweets = tweets.reduce(function (coll, item) {
                                coll.push(item);
                                return coll;
                            }, this._tweets);
                            this._block = false;
                        }, error => {
                            console.error("Unhandled error", error);
                            clearInterval(this.clientLoop);
                        });
                    }
                }, 10);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     *
     * @param position
     * @returns {*}
     */
    request(position) {
        let urlAppend = '';
        urlAppend += `from:${this._user.name} since:${this._user.since} until:${this._user.until}`;
        return `${TwitterClient.timeLine}?f=realtime&q=${encodeURIComponent(urlAppend)}&src=typd&max_position=${position}`;
    }

    /**
     *
     * @param req
     * @returns {Promise<T>|Promise}
     */
    response (req) {
        return new Promise((resolve, reject) => {
            this._block = true;
            console.log(req);
            request({
                method: 'GET', url: req
            }, (err, response, body) => {
                if (err) {
                    reject(Error(err));
                }
                if (response.statusCode === 200) {
                    resolve(this.tweetsParsing(body));
                } else {
                    reject(Error(response.statusCode));
                }
            });
        });
    }

    /**
     *
     * @param responseBody
     * @returns {boolean}
     */
    tweetsParsing(responseBody) {
        let from_page = JSON.parse(responseBody),
            items = from_page.items_html,
            $ = cheerio.load(items),
            tweets = [];

        let resultStatus = true;

        if (this._pointer !== from_page.min_position) {
            this._pointer = from_page.min_position;

            if (this._pointer !== 'TWEET--') {
                $('div.js-stream-tweet').each(function () {
                    $(this).filter(function () {
                        let $ = cheerio.load(this);
                        let tweet = new Tweet();
                        tweet.id = $(this).first().attr('data-tweet-id');
                        tweet.text = $('p.js-tweet-text').first().text();
                        tweet.date = $('small.time span.js-short-timestamp').first().attr('data-time-ms');
                        tweet.name = $('span.username.js-action-profile-name b').first().text();
                        tweet.reTweets = $('span.ProfileTweet-action--retweet span.ProfileTweet-actionCount')
                            .first().attr('data-tweet-stat-count');
                        tweet.link = `${TwitterClient.twitterUrl}${$(this).first().attr('data-permalink-path')}`;
                        tweet.geoLabel = $('span.Tweet-geo').first().text();
                        tweet.favorites = $('span.ProfileTweet-action--favorite span.ProfileTweet-actionCount')
                            .first().attr('data-tweet-stat-count');
                        tweets.push(tweet);
                    });
                });
                resultStatus = tweets;
            } else {
                resultStatus = false;
            }
            console.log(this._pointer);
        } else {
            resultStatus = false;
        }
        return resultStatus;
    }

    /**
     *
     * @returns {*}
     */
    get user() {
        return this._user;
    }

    /**
     *
     * @param user
     */
    set user(user) {
        this._user = user;
    }

    /**
     *
     * @returns {string}
     */
    static get timeLine() {
        return twitterTimeLine;
    }

    /**
     *
     * @returns {string}
     */
    static get twitterUrl() {
        return twitterUrl;
    }

    /**
     *
     * @returns {*|Array}
     */
    get tweets() {
        return this._tweets;
    }

    /**
     *
     * @returns {Number}
     */
    getTweetsCount() {
        return this._tweets.length;
    }
};

