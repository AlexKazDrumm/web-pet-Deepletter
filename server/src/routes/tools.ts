import { Router } from 'express';
import type { ToolsRepository } from '../db/toolsRepo';

export function toolsRouter(repo: ToolsRepository): Router {
  const router = Router();
  router.get('/', async (_req, res, next) => {
    try {
      const tools = await repo.listTools();
      res.json({ tools });
    } catch (err) {
      next(err);
    }
  });
  return router;
}
