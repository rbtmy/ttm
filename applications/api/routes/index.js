import Router from 'koa-router';

const router = new Router();

/**
 * POST /:user/statuses/
 * params "since":"2013-05-05", "until":"2014-05-05", "cnt": count
 *
 * GET /:user/statuses/:count
 *
 */
router.post('/:user/statuses/', async ctx => {

});

router.get('/:user/statuses/:count', async ctx => {

});

export default router