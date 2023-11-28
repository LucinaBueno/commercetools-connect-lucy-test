import { Router } from 'express';

import { logger } from '../utils/logger.utils';

const eventRouter: Router = Router();

eventRouter.post('/', async (req, res) => {
  logger.info('Event message received');
  logger.info('-->> Event request:', JSON.stringify(req));
  res.status(200);
  res.send();
});

export default eventRouter;
