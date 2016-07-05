let Tweet = require('./models/tweet'),
    cheerio = require('cheerio'),
    request = require('request'),
    co = require('co');

const twitterUrl = 'https://twitter.com';

const twitterTimeLine = 'https://twitter.com/i/search/timeline';

/**
 *
 */
module.exports = class TwitterClient {

    /**
     * 
     * @param user
     */
    constructor(user) {
        this._user =  user;
        this._pointer = '';
        this._tweets = [];
        this._block = false;
    }

    /**
     *
     */
    fetch() {
        this.clientLoop = setInterval(() => {
            if (this._pointer === null || this.getTweetsCount() >= this._user.count) {
                clearInterval(this.clientLoop);
                console.log(this._tweets);
            }
            if (this._block === false) {
                this.response(this.request(this._pointer)).then(tweets => {

                    this._tweets = tweets.reduce(function(coll, item) {
                        coll.push(item);
                        return coll;
                    }, this._tweets);
                    this._block = false;
                }, error => {
                    console.error("Unhandled error", error);
                    clearInterval(this.clientLoop);
                });
            }
        }, 100);
    }

    /**
     *
     * @param position
     * @returns {*}
     */
    request(position) {
        let urlAppend = '';
        urlAppend += `from:${this._user.name} since:${this._user.since} until:${this._user.until}`;
        return  `${TwitterClient.timeLine}?f=realtime&q=${encodeURIComponent(urlAppend)}&src=typd&max_position=${position}`;
    }

    /**
     *
     * @param req
     * @returns {Promise<T>|Promise}
     */
    response (req) {
        return new Promise((resolve, reject) => {
            this._block = true;
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
     * @returns {Array}
     */
    tweetsParsing(responseBody) {
        let from_page = JSON.parse(responseBody),
            items = from_page.items_html,
            $ = cheerio.load(items),
            tweets = [];

        this._pointer = from_page.min_position;

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
                tweet.mentions =
                    tweet.link = $(this).first().attr('data-permalink-path');
                tweet.geoLabel = $('span.Tweet-geo').first().text();
                tweet.favorites = $('span.ProfileTweet-action--favorite span.ProfileTweet-actionCount')
                    .first().attr('data-tweet-stat-count');
                tweets.push(tweet);
            });
        });
        return tweets;
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

