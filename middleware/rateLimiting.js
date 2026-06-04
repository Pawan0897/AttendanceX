const rateLimit = require('express-rate-limit')

const Loginlimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message: 'Too many login attempts. Please wait 15 minutes before trying again.'
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,

});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50

})
module.exports = { Loginlimiter, apiLimiter }