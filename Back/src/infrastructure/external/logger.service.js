const { createLogger, format, transports } = require('winston');
const path = require('path');

// Destructure only the format helpers we need
const { combine, timestamp, printf, colorize, errors } = format;

/**
 * Custom log line format.
 * Prints stack trace instead of message when available (i.e. on Error objects).
 * Appends any extra metadata as JSON at the end of the line.
 * Example output: [10:23:01] info: Publication created | {"userId":"12"}
 */
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const extra = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level}: ${stack || message}${extra}`;
});

const logger = createLogger({
  // In production: only warn + error reach any transport.
  // In development: everything from debug upward is captured.
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',

  // Applied to every transport unless the transport overrides it.
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // full timestamp for file/structured logs
    errors({ stack: true }),                        // attach stack trace when logging an Error object
    logFormat,                                      // apply our custom line format
  ),

  transports: [
    // Always-on console transport.
    // Uses colorize() so levels are color-coded in the terminal.
    // Uses short HH:mm:ss timestamp — easier to read during development.
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        logFormat,
      ),
    }),

    // File transport — production only.
    // Captures only 'error' level entries so the file stays small and actionable.
    // Path resolves to <project-root>/logs/error.log regardless of where the file is imported from.
    ...(process.env.NODE_ENV === 'production'
      ? [new transports.File({
          filename: path.join(__dirname, '../../../../logs/error.log'),
          level: 'error',
        })]
      : []),
  ],
});

module.exports = logger;