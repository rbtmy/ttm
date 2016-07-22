 import Koa from 'koa'
 import views from 'koa-views'
 import serve from 'koa-static'
 import bodyParser from 'koa-bodyparser'
 import apiRoutes from './applications/api/routes/index'
 import siteRoutes from './applications/site/routes/index'
 import Tweet from './models/tweet'
 import session from "koa-session2";
 import Store from "./store.js";
 import redis from './configs/redis';
 import userAgent from '../koa2-useragent';

 const app = new Koa();

 // app.use(userAgent());
 //
 // app.use((ctx) => {
 //     console.log(this.state.userAgent);
 // });

 app.use(views(`${__dirname}/views`, { extension: 'jade' }));
 app.use(serve(`${__dirname}/public`));

 app.use(apiRoutes.routes());
 app.use(siteRoutes.routes());

 app.listen(3000, () => {
     console.log('Server running at http://localhost:3000')
 });

 export default app