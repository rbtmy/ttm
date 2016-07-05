import Router from 'koa-router'
const router = new Router();

/**
 * /statuses/conditions={"since":"2013-05-05", "until":"2014-05-05", "cnt": count}
 * /statuses/:user
 *
 */
router.get('/statuses/:user', async ctx => {
    await ctx.render('index')
}).get('/statuses/', async () => {
    try {
        var conditions = {};
        var query = this.request.query;

        if (query.conditions) {
            conditions = JSON.parse(query.conditions);
        }
    } catch (_error) {
        error = _error;
        return this.body = error;
    }
});

export default router