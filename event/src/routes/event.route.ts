import { Router } from 'express';

import { logger } from '../utils/logger.utils';

const eventRouter: Router = Router();

eventRouter.post('/', async (req, res) => {
  logger.info('Event message received...');
  logger.info('-> Event request:', req);
  logger.info('-> OG_CLIENT_ID:', process.env.OG_CLIENT_ID);
  logger.info('-> OG_CLIENT_SECRET:', process.env.OG_CLIENT_SECRET);
  res.status(200);
  res.send();
});

export default eventRouter;
