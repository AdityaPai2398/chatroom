// package
const Koa = require('koa');
const path = require('path');
// const IO = require('koa-socket');
const json = require('koa-json');
const cors = require('@koa/cors');
const koaSend = require('koa-send');
const logger = require('koa-logger');
const kosStatic = require('koa-static');
const bodyparser = require('koa-bodyparser');

// local
const allRouter = require('./routes/index.js');
// const Group = require('./models/Group.model');
// const User = require('./models/User.model');
// const Token = require('./models/Token.model');

// application
const app = new Koa();

app
  .use(bodyparser())
  .use(json())
  .use(cors())
  .use(logger())
  .use(kosStatic(path.resolve('./dist'), {
    // maxAge: 1000 * 60 * 60 * 24 * 7,
    gzip: true,
  }))
  .use(allRouter.routes())
  .use(allRouter.allowedMethods())
  // 将前端路由指向 index.html
  .use(async (ctx, next) => {
    if (!/\./.test(ctx.request.url)) {
      await koaSend(
        ctx,
        'index.html',
        {
          root: path.resolve('./dist'),
          // maxage: 1000 * 60 * 60 * 24 * 7,
          gzip: true,
        } // eslint-disable-line
      );
    } else {
      await next();
    }
  });

module.exports = app;
