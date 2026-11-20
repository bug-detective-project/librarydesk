import express from 'express';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import Sequelize from 'sequelize';
import { HttpError } from './errors.ts';
import { bookRoutes } from './routes/books.ts';
import { loanRoutes } from './routes/loans.ts';
import { readerRoutes } from './routes/readers.ts';

export function createApp(options: { log?: (line: string) => void } = {}): express.Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(allowedHost);
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', bookRoutes());
  app.use('/api', readerRoutes());
  app.use('/api', loanRoutes());

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
  app.use(handleError(options.log ?? ((line) => console.error(line))));
  return app;
}

/** Hosts the API answers; the port is ignored. */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * The app runs on the player's computer and only the local client talks to it: a page on the
 * internet that reaches the API through the browser sends another Host, and gets 403.
 */
const allowedHost: RequestHandler = (req, res, next) => {
  const host = req.headers.host ?? '';
  const name = host.startsWith('[') ? host.slice(0, host.indexOf(']') + 1) : host.replace(/:\d+$/, '');
  if (LOCAL_HOSTS.has(name.toLowerCase())) {
    next();
    return;
  }
  res.status(403).json({ error: 'Forbidden host' });
};

/**
 * Turns what a route threw into an answer. The librarian reads the body, so it never carries what
 * only the team should see: an error nobody planned for goes to the log, and the answer says only
 * that something went wrong.
 */
function handleError(log: (line: string) => void): ErrorRequestHandler {
  return (error: unknown, _req, res, _next) => {
    if (error instanceof HttpError) {
      res.status(error.status).json({ error: error.message, ...(error.fields && { fields: error.fields }) });
      return;
    }
    // A body that is not JSON, or too large.
    const status = (error as { status?: number }).status;
    if (status === 400 || status === 413) {
      res.status(status).json({ error: status === 400 ? 'The body is not valid JSON' : 'The body is too large' });
      return;
    }
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(409).json({ error: 'Something with these values already exists' });
      return;
    }
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      res.status(409).json({ error: 'Other records still point to this one' });
      return;
    }
    log(`Unexpected error: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`);
    res.status(500).json({ error: 'Something went wrong on the server' });
  };
}
