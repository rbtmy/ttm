import Router from 'koa-router';
const router = new Router();

/**
 * The router to display the data on the website
 */

router.get('/', async ctx => {
    // body = await parser(ctx);
    // console.log(body);
    await ctx.render('index');
});

export default router;