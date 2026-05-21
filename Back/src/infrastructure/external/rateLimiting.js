const rateLimit = require('express-rate-limit');

// key generator for rate limiting, based on user id if authenticated, otherwise by IP
const keyByUser = (req) => req.user?.id ? String(req.user.id) : req.ip;

// response
const response = (req, res) => {
  const wantsJson  =
    req.xhr ||
    req.headers['x-requested-with'] === 'XMLHttpRequest' ||
    req.method === 'POST' ||
    req.path.startsWith('/api');

  if (wantsJson) {
    return res.status(429).json({
      error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.',
    });
  }

  return res.status(429).render('errors/429');
};

const loginHandler = (req, res) => {
  const wantsJson =
    req.xhr ||
    req.headers['x-requested-with'] === 'XMLHttpRequest' ||
    req.headers.accept?.includes('application/json');

  if (wantsJson) {
    return res.status(429).json({
      error: 'Demasiados intentos. Espera 15 minutos e intenta de nuevo.',
    });
  }

  return res.redirect('/auth?error=Demasiados+intentos.+Espera+15+minutos+e+intenta+de+nuevo.');
};

// login by IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: loginHandler,
});

// log user by id, for routes that require authentication
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  keyGenerator: keyByUser,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: response,
  validate: { keyGeneratorIpFallback: false },
});

// public routes with out log user, by IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: response,
});

// to post publications, limit by user id
const publicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10,                 // 10 publication per hour
  keyGenerator: keyByUser,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: response,
  validate: { keyGeneratorIpFallback: false },
});

module.exports = { loginLimiter, generalLimiter, apiLimiter, publicationLimiter };
