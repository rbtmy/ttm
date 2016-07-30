 import Koa from 'koa'
 import views from 'koa-views'
 import serve from 'koa-static'
 import bodyParser from 'koa-bodyparser'
 import apiRoutes from './applications/api/routes/index'
 import siteRoutes from './applications/site/routes/index'
 import mount from 'koa-mount';
 import Tweet from './models/tweet'
 import session from "koa-session2";
 import redis from './configs/redis';
 import userAgent from 'koa2-useragent';
 import co from 'co';
 import render from 'koa-ejs';
 import path from 'path';

 const app = new Koa();

 /**
  *  Template for instagram
  *
  */

 // var InstagramPosts, streamOfPosts;
 // InstagramPosts = require('instagram-screen-scrape').InstagramPosts;
 //
 // streamOfPosts = new InstagramPosts({
 //  username: 'greenlool'
 // });
 //
 // streamOfPosts.on('data', function(post) {
 //     var time = new Date(post.time * 1000);
 //     console.log([
 //         "greenlool's post from ",
 //         time.toLocaleDateString(),
 //         " got ",
 //         post.likes,
 //         " like(s), and ",
 //         post.comments,
 //         " comment(s)",
 //         "media: ",
 //         post.media
 //     ].join(''));
 // });

 app.use(userAgent());

 app.use(async (ctx, next) => {
     // console.log(ctx.userAgent.version);
     await next();
 });
 //app.use(convert(require('koa-static')(__dirname + '/public')));
 app.use(serve(`${__dirname}/public`));
 app.use(views(`${__dirname}/views`, { extension: 'ejs' }));

 //app.use(mount('/static', serve('public')));
 app.use(bodyParser());

 app.use(apiRoutes.routes());
 app.use(siteRoutes.routes());

 app.listen(3000, () => {
     console.log('Server running at http://localhost:3000');
 });

 export default app