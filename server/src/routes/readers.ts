import { Router } from 'express';
import { findReader, findReaders, openLoans, payFines } from '../library.ts';

export function readerRoutes(): Router {
  const router = Router();

  router.get('/readers', async (req, res) => {
    res.json(await findReaders(req.query.q));
  });

  router.get('/readers/:id', async (req, res) => {
    res.json(await findReader(req.params.id));
  });

  router.get('/readers/:id/loans', async (req, res) => {
    res.json(await openLoans(req.params.id));
  });

  router.post('/readers/:id/fines/pay', async (req, res) => {
    res.json(await payFines(req.params.id));
  });

  return router;
}
