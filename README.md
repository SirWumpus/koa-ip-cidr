koa-ip-cidr
===========

Filter IPv4 and IPv6 addresses using IP/CIDR masks.


Install
-------

```lang=sh
npm install --save koa-ip-cidr
```


Usage
-----

### ip_cidr_filter([options])

* `options`;
  - `blacklist`: Optional array of IPv4 and/or IPv6 CIDR masks to reject.
  - `whitelist`: Optional array of IPv4 and/or IPv6 CIDR masks to allow.
  - `throw`: Set true to throw an error instead of returning HTTP status 403.
  
When `options` is not specified, then the default is `{ whitelist: [ "::1", "127.0.0.0/8" ] }`.


Example
-------

```lang=js
const Koa = require('koa');
const ip_cidr_filter = require('..');

const app = new Koa();

app.use(ip_cidr_filter({
    whitelist: ["192.0.2.0/24", "192.168.0.0/16", "2001:DB8::DEAD:0/112"]
})).use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(1234);
```


## Copyright

Copyright 2019 by Anthony Howe.  All rights reserved.

## MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
