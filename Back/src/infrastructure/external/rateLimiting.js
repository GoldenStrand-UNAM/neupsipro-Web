const rateLimit = require('express-rate-limit')

// General rate limiter: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

// Login limiter.....
const loginLimiter = rateLimit({

})

// Publication limiter: 5 requests per hour
const publicationLimiter = rateLimit({

})

module.exports = { generalLimiter, loginLimiter, publicationLimiter,
}