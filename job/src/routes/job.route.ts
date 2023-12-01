import { Router } from 'express';

import { post } from '../controllers/job.controller';
import { logger } from '../utils/logger.utils';

// Create the router for our app
const jobRouter: Router = Router();

jobRouter.post('/', async (req, res, next) => {
  try {
    logger.info('-> Job request:', req);

    const ctpProjectKey = process.env.CTP_PROJECT_KEY as string;
    const ogClientId = process.env.OG_CLIENT_ID as string;
    const ogClientSecret = process.env.OG_CLIENT_SECRET as string;

    logger.info('-> CTP_PROJECT_KEY:' + ctpProjectKey);
    logger.info('-> OG_CLIENT_ID:' + ogClientId);
    logger.info('-> OG_CLIENT_SECRET:' + ogClientSecret);

    await post(req, res);
    next();
  } catch (error) {
    next(error);
  }
});

export default jobRouter;
