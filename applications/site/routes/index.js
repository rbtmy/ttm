import Router from 'koa-router';
import User from '../../../models/user'
import TwitterClient from '../../../client';
import ApiCache from '../../../api-cache';
import parser from 'co-body';
import moment from 'moment';
import empty from 'is-empty';
import hash from 'object-hash';
import Redis from 'ioredis';

const router = new Router();
const firstTweetCountSearchedTweets = 3500;
const offsetPage = 18;

/**
 *
 * @param offset
 * @returns {{}}
 */
function offsetTranslateToTweets(offset) {
    let twsSeq = {};
    if (offset === 0) {
        twsSeq = {start: 0, end: offsetPage}
    } else {
        let start = offset * offsetPage;
        let end = start + offsetPage;
        twsSeq = {start: start, end: end};
    }
    return twsSeq;
}

router.get('/', async ctx => {
    await ctx.render('index');
});

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
    let twitterClient = new TwitterClient({}, ApiCache);
    let user = new User();
    let body = await parser(ctx);
    let apiCache = new ApiCache();
    let offset = body.offset;
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

    let hashKey = hash(cachedParams);

    //await apiCache.destroy(cachedParams);
    //process.exit();
    /**
     * Waiting for data from cache
     */
    await apiCache.get(cachedParams);

    let tweets = await apiCache.cachedValue;
    let redis = new Redis();
    redis.subscribe('tweets', function (err, count) {

    });
    if (tweets === null) {
        twitterClient.fetch();
        redis.on('message',  (channel, message) => {
            console.log('ok');
            /**
             * Waiting for data from cache
             */
                //apiCache.get(cachedParams);
                //tweets = apiCache.cachedValue;
                //if (empty(offset)) {
                //    offset = 0;
                //}
                //
                //let twSeq = offsetTranslateToTweets(offset);
                //if (empty(twSeq) === false) {
                //    console.log(tweets.slice(0,10));
                //    ctx.body = JSON.stringify(tweets.slice(twSeq.start, twSeq.end));
                //}
            console.log('Receive message %s from channel %s', message, channel);
        });
    } else {
        if (empty(offset)) {
            offset = 0;
        }

        let twSeq = offsetTranslateToTweets(offset);
        if (empty(twSeq) === false) {
            console.log(tweets.slice(0,10));
            ctx.body = JSON.stringify(tweets.slice(twSeq.start, twSeq.end));
        }
    }


    //await console.log(apiCache.cachedValue);


});

/**
 * The first tweet of a user
 */
router.get('/statuses/:user/one/', async ctx => {
    let twitterClient = new TwitterClient();
    let user = new User();
    user.name = ctx.params.user;

    let pushUser = name => {
        if (typeof name !== 'undefined') {
            user.name = name;
            user.count = firstTweetCountSearchedTweets;
            twitterClient.user = user;
        }
    };

    await pushUser(user.name);
    await twitterClient.fetchOne();

    ctx.body = await JSON.stringify(twitterClient.getFirstTweet());
});

export default router