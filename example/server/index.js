const koa = require('koa');
const router = require('koa-router')();

const { vueDevServer } = require('./middlewares/vue');
const { HtmlWriterStream } = require('./middlewares/html-writer-stream');

exports.createServer = function (host, port, cb) {
  let app = new koa();
  app.use(vueDevServer());

  router.get('/', async (ctx, next) => {
    ctx.type = 'html';
    if (ctx.vue) {
      let stream = ctx.vue.renderToStream();
      let htmlWriter = new HtmlWriterStream();
      ctx.body = stream.pipe(htmlWriter);
    } else {
      console.log('no .vue object found on ctx. No SSR streaming possible :()');
    }
    await next();
  });

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return app.listen(port, host, cb);
};
