import { Router } from 'express';
import { findLoans, lend, renew, returnLoan } from '../library.ts';

export function loanRoutes(): Router {
  const router = Router();

  router.get('/loans', async (req, res) => {
    res.json(await findLoans(req.query.status));
  });

  router.post('/loans', async (req, res) => {
    res.status(201).json(await lend(req.body ?? {}));
  });

  router.post('/loans/:id/return', async (req, res) => {
    res.json(await returnLoan(req.params.id));
  });

  router.post('/loans/:id/renew', async (req, res) => {
    res.json(await renew(req.params.id));
  });

  return router;
}
