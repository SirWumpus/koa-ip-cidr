const Koa = require('koa');
const ip_cidr_filter = require('..');

const app = new Koa();

app.use(ip_cidr_filter({
    whitelist: ["192.0.2.0/24", "192.168.0.0/16", "2001:DB8::DEAD:0/112"]
})).use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(1234);
