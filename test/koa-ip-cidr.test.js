'use strict';

// DEBUG="koa-ip-cidr" npm test
// DEBUG="koa*" npm test

const Koa = require('koa');
const koa_ip_cidr = require('..');
const request = require('supertest');

function client_ip(ip) {
    return async (ctx, next) => {
        ctx.request.ip = ip;
        await next();
    };
}

function hello_world() {
    return async ctx => {
        ctx.body = 'Hello World';
    };
}

describe('koa-ip-cdr', () => {
    it('should allow localhost when no options supplied', async () => {
        ["127.0.0.1", "127.1.2.3", "::1"].forEach(async (client) => {
            const app = new Koa();
            app.use(client_ip(client));
            app.use(koa_ip_cidr());
            app.use(hello_world());
            await request(app.callback()).get('/').expect(200);
        });
    });
    it('should reject non-localhost when no options supplied', async () => {
        ["192.0.2.1", "2001:DB8::DEAD:BEEF"].forEach(async (client) => {
            const app = new Koa();
            app.use(client_ip(client));
            app.use(koa_ip_cidr());
            app.use(hello_world());
            await request(app.callback()).get('/').expect(403);
        });
    });
    it('should allow IP only in whitelist and no blacklist', async () => {
        [
            {ip: "192.0.2.1", status: 200},
            {ip: "2001:DB8::DEAD:BEEF", status: 200},
            {ip: "192.168.1.2", status: 403},
        ].forEach(async (test) => {
            const app = new Koa();
            app.use(client_ip(test.ip));
            app.use(koa_ip_cidr({whitelist: ["192.0.2.0/24", "2001:DB8::DEAD:0/112"]}));
            app.use(hello_world());
            await request(app.callback()).get('/').expect(test.status);
        });
    });
    it('should reject IP only in blacklist and no whitelist', async () => {
        [
            {ip: "192.0.2.1", status: 403},
            {ip: "2001:DB8::DEAD:BEEF", status: 403},
            {ip: "192.168.1.2", status: 200},
        ].forEach(async (test) => {
            const app = new Koa();
            app.use(client_ip(test.ip));
            app.use(koa_ip_cidr({blacklist: ["192.0.2.0/24", "2001:DB8::DEAD:0/112"]}));
            app.use(hello_world());
            await request(app.callback()).get('/').expect(test.status);
        });
    });
});
