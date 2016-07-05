import Router from 'koa-router'
const router = new Router();

/**
 * /:user/statuses/:cond={"since":"2013-05-05", "until":"2014-05-05", "cnt": count} count tweets
 * /:user/statuses all tweets around
 *
 */
router.get('/:user/statuses/', async ctx => {

});

router.get('/:user/statuses/:cond', async ctx => {
    try {
        let query = ctx.params.cond;
    } catch (_error) {
        error = _error;
        ctx.body = error;
    }
});

export default router