import { Router } from 'express';

export function healthRouter(): Router {
  const router = Router();
  const startedAt = Date.now();
  router.get('/', (_req, res) => {
    res.json({ status: 'ok', uptimeSeconds: Math.round((Date.now() - startedAt) / 1000) });
  });
  return router;
}
