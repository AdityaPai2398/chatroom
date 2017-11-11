//package
const path = require('path');
const Koa = require('koa');
const IO = require('koa-socket');
const json = require('koa-json');
const send = require('koa-send');
const session = require('koa-session');
const koaStatic = require('koa-static');
const enforceHttps = require('koa-sslify');
const WebSocket = require('faye-websocket');
const Router = require('koa-router');
const rp = require('request-promise')
const bodyParser = require('koa-bodyparser');

//localFile
const applyRoutes = require('./routes');
const test = require('./middlewares/test');
const config = require('../../config/server');
// const addMethods = require('./middlewares/addMethods');
// const log = require('./middlewares/log');
// const close = require('./middlewares/close');
// const notFound = require('./middlewares/notFound');
// const police = require('./middlewares/police');
// const catchError = require('./middlewares/catchError');
// const Socket = require('./models/socket');

//application
const app = new Koa();
const io = new IO()

app.keys = [config.secret];
// app.use(session({
//     key: 'token',
//     maxAge: 100000,
//     overwrite: true,
//     httpOnly: true,
//     signed: true,
//     rolling: false,
// }, app));


app.use(koaStatic( path.resolve('./dist'), {
    gzip: true,
    maxAge:  1000 * 60 * 60 * 24 * 7,
}))

// // Force HTTPS on all page
// app.use(enforceHttps({
//     trustProtoHeader: true
// }));

// app.use(async (ctx) => {
//     await send(
//         ctx,
//         'index.html',
//         {
//             root: path.join(__dirname, '../../dist'),
//             maxage: 1000 * 60 * 60 * 24 * 7,
//             gzip: true,
//         }
//     );
// })


// io.attach(app)

// io.use( async ( ctx, next ) => {
//     let start = new Date()
//     await next()
//     console.log( `response time: ${ new Date() - start }ms` )
// })

// applyRoutes(io);



const router = require('./routes')

router.get("/mygithub", async(ctx) => {
    // let option = {
        // uri: `https://github.com/login/oauth/access_token?client_id=${config.githubClientID}&client_secret=${config.githubClientSecret}&code=`,
    //     json: true
    // } 
    // let path = `https://github.com/login/oauth/authorize?client_id=${config.githubClientID}&client_secret=${config.githubClientSecret}&code=`
    // let tokenResp = await rp(option);
    // console.log(path);
    // ctx.redirect(path);


    let code = ctx.request.query["code"];
    let option = {
        uri: `https://github.com/login/oauth/authorize`,
        qs: {
            client_id:  config.githubClientID,
            client_secret:  config.githubClientSecret
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    } 
    console.log(option);
    let tokenResp = await rp(option);
    console.log(tokenResp);
    // option = {
    //     uri: "https://api.github.com/user?access_token=" + tokenResp.access_token,
    //     headers: {
    //         'User-Agent': 'Request-Promise'
    //     },
    //     json: true
    // }
    // let userInfo = await rp(option);
    // console.log(userInfo);
})

app
    .use(router.routes())
    .use(router.allowedMethods());


// // The raw socket.io instance is attached as app._io if you need it
// app.io.on( 'connection', sock => {
//     console.log('somebody connected!');
// })

// // The raw socket.io instance is attached as app._io if you need it
// app.io.on( 'disconnect', sock => {
//     console.log('disconnect!');
// })

module.exports = app;