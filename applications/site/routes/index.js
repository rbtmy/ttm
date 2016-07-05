import Router from 'koa-router';
import User from '../../../models/user'
const router = new Router();

router.get('/', async ctx => {
    await ctx.render('index');
});

router.post('/statuses/', async ctx => {
    let user = new User()
    console.log(ctx.request.body)
});

router.get('/statuses/:user/:count', async ctx => {
    let user = new User();
    user.count = ctx.params.count;
    user.name = ctx.params.user;

    console.log(user);
});

export default router