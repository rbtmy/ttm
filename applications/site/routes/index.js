import Router from 'koa-router';
import User from '../../../models/user'
import TwitterClient from '../../../client';
import parser from 'co-body';

const router = new Router();
const twitterClient = new TwitterClient();

router.get('/', async ctx => {
    await ctx.render('index');
});

router.post('/statuses/', async ctx => {
    let user = new User();
    let body = await parser(ctx);

    let checkUser = body => {
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
    await checkUser(body);
    await twitterClient.fetch();
    let tweets = twitterClient.tweets;
        //twitterClient.fetch();
    await console.log(tweets);
});

/**
 * The first tweet of a user
 */
router.get('/statuses/:user/one/', async ctx => {
    let user = new User();
    user.count = ctx.params.count;
    user.name = ctx.params.user;
    console.log(user);
});

export default router