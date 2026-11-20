import { Router } from 'express';
import { createBook, findBook, findBooks, reserve, searchAuthors } from '../library.ts';

export function bookRoutes(): Router {
  const router = Router();

  router.get('/books', async (req, res) => {
    res.json(await findBooks(req.query.q));
  });

  router.get('/books/:id', async (req, res) => {
    res.json(await findBook(req.params.id));
  });

  router.post('/books', async (req, res) => {
    res.status(201).json(await createBook(req.body ?? {}));
  });

  router.post('/books/:id/reservations', async (req, res) => {
    res.status(201).json(await reserve(req.params.id, req.body ?? {}));
  });

  router.get('/authors', async (req, res) => {
    res.json(await searchAuthors(req.query.q));
  });

  return router;
}
