import { Router } from 'express';
const {execSync} = require('child_process');

import { post } from '../controllers/job.controller';
import { logger } from '../utils/logger.utils';

// Create the router for our app
const jobRouter: Router = Router();

jobRouter.post('/', async (req, res, next) => {
  try {
    await post(req, res);
    next();
  } catch (error) {
    logger.info('Error at job.route.js / -> ', error);
    next(error);
  }
});

export default jobRouter;
