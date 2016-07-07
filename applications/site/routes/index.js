import Router from 'koa-router';
import User from '../../../models/user'
import TwitterClient from '../../../client';
import parser from 'co-body';
import moment from 'moment';

const router = new Router();

router.get('/', async ctx => {
    await ctx.render('index');
});

router.post('/statuses/', async ctx => {
    let twitterClient = new TwitterClient();
    let user = new User();
    let body = await parser(ctx);

    let pushUser = body => {
        if (typeof body.user != 'undefined' && body.since != undefined) {
            user.count = body.count;
            user.name = body.user;
            user.since = body.since;
            user.until = body.until;
            //console.log(user);
            twitterClient.user = user;
            //console.log(twitterClient.user);
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
            user.count = 999;
            twitterClient.user = user;
        }
    };

    await pushUser(user.name);
    await twitterClient.fetch();

    ctx.body = JSON.stringify(twitterClient.tweets);
});

export default router