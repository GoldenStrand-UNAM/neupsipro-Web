const logger = require('../external/logger.service');

/**
 * HTTP request logger middleware.
 * Attaches to every response and logs method, URL, status code,
 * duration, and user once the response is finished.
 * Log level is chosen automatically based on the HTTP status code.
 */
const requestLogger = (req, res, next) => {
  // Capture the moment the request arrived so we can compute duration later
  const start = Date.now();

  // 'finish' fires when Express has sent the last byte of the response.
  // We log here instead of before next() so we have the real status code.
  res.on('finish', () => {
    const duration = Date.now() - start;

    const meta = {
      method:  req.method,               // GET, POST, PUT, DELETE …
      url:     req.originalUrl,          // full path including query string
      status:  res.statusCode,           // final HTTP status sent to the client
      ms:      duration,                 // total time from request in to response out
      user:    req.user?.id || 'anonymous', // JWT-decoded user id, or anonymous if unauthenticated
    };

    // 5xx → server fault, always an error worth investigating
    if (res.statusCode >= 500) return logger.error('Server error', meta);

    // 4xx → client sent a bad request (validation, auth, not found, etc.)
    if (res.statusCode >= 400) return logger.warn('Client error', meta);

    // 2xx / 3xx → normal successful or redirect response
    logger.info('Request', meta);
  });

  // Pass control to the next middleware; logging happens asynchronously on finish
  next();
};

module.exports = requestLogger;