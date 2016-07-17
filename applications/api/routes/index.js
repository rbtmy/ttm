import Router from 'koa-router';
import User from '../../../models/user'
import TwitterClient from '../../../client';
import ApiCache from '../../../api-cache';
import parser from 'co-body';
import moment from 'moment';
import empty from 'is-empty';
import hash from 'object-hash';
import {redisInstance} from '../../../configs/redis';

const router = new Router();
const firstTweetCountSearchedTweets = 3500;
const offsetPage = 18;
const redis = redisInstance();

/**
 *
 * @param username
 */
let setUsernameView = async username => {
    username = username.replace(/^@/, '');
    let apiCache = new ApiCache(),
        view = await apiCache.getUserViews(username);
    console.log(view);
    if (view === null) {
        apiCache.setUserView(username, 1);
    } else {
        view = parseInt(view) + 1;
        apiCache.setUserView(username, view);
    }
};

/**
 * Schema caching API requests to the client
 *
 * The client should always send "since" and not necessarily "until" and "count".
 * The client must send the offset parameter to get the entire set of tweets.
 * Ok, the first request should be a POST user=robotomize&since=2014-05-05.
 * In response, the server will send to his 18 tweets.
 * Next request should be a POST user=robotomize&since=2014-05-05&offset=1, the server will return another 18 tweets
 */


router.post('/statuses/', async ctx => {
    let twitterClient = new TwitterClient({}, ApiCache),
        user = new User(),
        body = await parser(ctx),
        apiCache = new ApiCache(),
        offset = body.offset;
    let pushUser = body => {
        if (typeof body.user != 'undefined' && body.since != undefined) {
            if (empty(body.count)) {
                user.count = firstTweetCountSearchedTweets;
            } else {
                user.count = body.count;
            }

            user.name = body.user;
            user.since = body.since;
            if (empty(body.until)) {
                user.until = moment().format('YYYY-MM-DD');
            } else {
                user.until = body.until;
            }
            twitterClient.user = user;
        }
    };

    await pushUser(body);

    let cachedParams = {
        since: user.since,
        until: user.until,
        count: user.count,
        user: twitterClient.user.name
    };

    let hashKey = hash(cachedParams),
        tweets = await apiCache.get(cachedParams);
    await setUsernameView(user.name);

    redis.subscribe('tweets', (err, count) => {

    });

    if (tweets === null) {
        twitterClient.fetch();
        let getTweets = () => {
            return new Promise((resolve, reject) => {
                redis.on('message', async(channel, message) => {
                    if (channel === 'tweets' && message === hashKey) {
                        try {
                            tweets = await apiCache.get(cachedParams);
                            if (empty(offset)) {
                                offset = 0;
                            }

                            let twSeq = offsetTranslateToTweets(offset);
                            if (empty(twSeq) === false) {
                                resolve(JSON.stringify(tweets.slice(twSeq.start, twSeq.end)));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    }
                });
            });
        };
        tweets = await getTweets();
        ctx.body = tweets;
    } else {
        if (empty(offset)) {
            offset = 0;
        }
        let twSeq = offsetTranslateToTweets(offset);
        if (empty(twSeq) === false) {
            ctx.body = JSON.stringify(tweets.slice(twSeq.start, twSeq.end));
        }
    }
});

/**
 * The first tweet of a user
 */
router.get('/statuses/first/:user', async ctx => {
    let twitterClient = new TwitterClient({}, ApiCache),
        user = new User(),
        apiCache = new ApiCache(),
        limit = ctx.params.limit;
    user.name = ctx.params.user;

    let pushUser = name => {
        if (typeof name !== 'undefined') {
            user.name = name;
            user.count = firstTweetCountSearchedTweets;
            twitterClient.user = user;
        }
    };

    await pushUser(user.name);

    let tweet = await apiCache.getFirstTweet(user.name);

    await setUsernameView(user.name);

    if (tweet === null) {
        await twitterClient.fetchOne();
        tweet = await twitterClient.getFirstTweet();
        await apiCache.setFirstTweet(user.name, tweet);
        ctx.body = JSON.stringify(tweet);
    } else {
        ctx.body = JSON.stringify(tweet);
    }
});

router.get('/statuses/first/:user/:limit/', async ctx => {
    let twitterClient = new TwitterClient({}, ApiCache),
        user = new User(),
        apiCache = new ApiCache(),
        limit = ctx.params.limit;
    user.name = ctx.params.user;

    let pushUser = name => {
        if (typeof name !== 'undefined') {
            user.name = name;
            user.count = firstTweetCountSearchedTweets;
            twitterClient.user = user;
        }
    };

    await pushUser(user.name);

    let tweet = await apiCache.getFirstLimitTweets(user.name, limit);

    await setUsernameView(user.name);

    if (tweet === null) {
        await twitterClient.fetchOne();
        tweet = await twitterClient.getFirstTweet();
        await apiCache.setFirstTweet(user.name, tweet);
        ctx.body = JSON.stringify(tweet);
    } else {
        ctx.body = JSON.stringify(tweet);
    }
});

/**
 * Get number of views of a particular user account
 */
router.get('/views/:user', async ctx => {
    let user = new User();
    let apiCache = new ApiCache();
    user.name = ctx.params.user;
    let username = user.name.replace(/^@/, '');
    ctx.body = await apiCache.getUserViews(username);
});

/**
 *
 * @param offset
 * @returns {{}}
 */
let offsetTranslateToTweets = offset => {
    let twsSeq = {};
    if (offset === 0) {
        twsSeq = {start: 0, end: offsetPage}
    } else {
        let start = offset * offsetPage;
        let end = start + offsetPage;
        twsSeq = {start: start, end: end};
    }
    return twsSeq;
};

/**
 * Util function
 *
 * @param user
 */
let cacheCleaner = async user => {
    let cachedParams = {
        since: user.since,
        until: user.until,
        count: user.count,
        user: user.name
    };
    apiCache = new ApiCache();
    await apiCache.deleteUserViews(user.name);
    await apiCache.deleteFirstTweet(user.name);
    await apiCache.destroy(cachedParams);
    process.exit();
};

export default router