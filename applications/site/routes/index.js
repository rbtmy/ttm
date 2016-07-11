import Router from 'koa-router';
import User from '../../../models/user'
import TwitterClient from '../../../client';
import parser from 'co-body';
import moment from 'moment';
import empty from 'is-empty';

const router = new Router();
const firstTweetCountSearchedTweets = 3500;

router.get('/', async ctx => {
    await ctx.render('index');
});

router.post('/statuses/', async ctx => {
    let twitterClient = new TwitterClient();
    let user = new User();
    let body = await parser(ctx);

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
    await twitterClient.fetch();
    await console.log(user);

    ctx.body = JSON.stringify(twitterClient.tweets);
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