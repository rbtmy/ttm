import Router from 'koa-router';
const router = new Router();

router.get('/', async ctx => {
    //await ctx.render('index');
});
router.get('/statuses/:condition', async ctx => {
    //console.log(ctx);
    //try {
    //    var conditions = {};
    //    var query = ctx.params.condition;
    //    console.log(query);
    //    if (query) {
    //        conditions = JSON.parse(query);
    //    }
    //    //console.log(conditions);
    //} catch (_error) {
    //    error = _error;
    //    return this.body = error;
    //}
});
export default router