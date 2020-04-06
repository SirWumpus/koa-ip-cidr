'use strict';

const debug = require('debug')('koa-ip-cidr');
const ipaddr = require('ipaddr.js');

function isIpMember(ip, cidr_list) {
    debug(ip, cidr_list);
    if (!Array.isArray(cidr_list)) {
        return false;
    }

    // Parse IPv6, IPv4, or IPv4-mapped.  ipaddr.parse() returns IPv6
    // object for IPv4-mapped, while ipaddr.process() returns an IPv4
    // object for IPv4-mapped.
    const client = ipaddr.process(ip);
    const client_family = client.kind();

    return cidr_list.some((cidr) => {
        // ipaddr.parseCIDR() does not handle a simple IP address
        // missing the CIDR suffix.
        try {
            const network = ipaddr.parse(cidr);
            // Parsed IP address without /BITS; append default.
            cidr += network.kind() === 'ipv6' ? '/128' : '/32';
        } catch (err) {
            // Already has CIDR bit specifier.
        }
        const netmask = ipaddr.parseCIDR(cidr); // [ range, bits ]
        return client_family === netmask[0].kind() && client.match(netmask);
    });
}

module.exports = function (opts) {
    if (!opts) {
        opts = { whitelist: [ "::1", "127.0.0.0/8" ] };
    }
    return async (ctx, next) => {
        if (opts.whitelist && isIpMember(ctx.ip, opts.whitelist)) {
            debug(`${ctx.ip} allowed`);
            return next();
        }
        if (opts.blacklist && !isIpMember(ctx.ip, opts.blacklist)) {
            debug(`${ctx.ip} not blocked`);
            return next();
        }
        debug(`${ctx.ip} blocked`);
        if (opts.throw) {
            ctx.throw(403, "client blocked");
        }
        // Set status, instead of throw, to work back through middleware
        // stack post-processing the response, such as logging.
        ctx.response.status = 403;
        ctx.response.message = "client blocked";
    };
};

module.exports.isIpMember = isIpMember;
