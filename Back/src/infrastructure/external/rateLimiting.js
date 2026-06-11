const rateLimit = require('express-rate-limit');

// key generator for rate limiting, always by IP
const keyByIp = (req) => req.ip;

// response
const response = (req, res) => {
  const wantsJson  =
    req.xhr ||
    req.headers['x-requested-with'] === 'XMLHttpRequest' ||
    req.method === 'POST' ||
    req.method === 'PATCH' ||
    req.method === 'PUT' ||
    req.method === 'DELETE' ||
    req.path.startsWith('/api') ||
    req.headers.accept?.includes('application/json');

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

// log user by IP, for routes that require authentication
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  keyGenerator: keyByIp,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: response,
});

// public routes with out log user, by IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: response,
});

// to post publications, limit by IP
const publicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10,                 // 10 publication per hour
  keyGenerator: keyByIp,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: response,
});

// to post users, limit by IP
const userLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 20,                 // 20 users per hour
  keyGenerator: keyByIp,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: response,
});

module.exports = { loginLimiter, generalLimiter, apiLimiter, publicationLimiter, userLimiter };
