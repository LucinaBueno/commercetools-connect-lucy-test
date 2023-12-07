import { Router } from 'express';
const {execSync} = require('child_process');

import { post } from '../controllers/job.controller';
import { logger } from '../utils/logger.utils';

// Create the router for our app
const jobRouter: Router = Router();

jobRouter.post('/', async (req, res, next) => {
  try {
    logger.info('-> Job request:', req);
    logger.info('-> Job request.query:', req.query);

    const ctpProjectKey = process.env.CTP_PROJECT_KEY as string;
    const ogClientId = process.env.OG_CLIENT_ID as string;
    const ogClientSecret = process.env.OG_CLIENT_SECRET as string;

    logger.info('-> / CTP_PROJECT_KEY:' + ctpProjectKey);
    logger.info('-> / OG_CLIENT_ID:' + ogClientId);
    logger.info('-> / OG_CLIENT_SECRET:' + ogClientSecret);

    /*execSync('sleep 60');
    logger.info('After sleep 1');
    execSync('sleep 60');
    logger.info('After sleep 2');
    execSync('sleep 60');
    logger.info('After sleep 3');
    execSync('sleep 60');
    logger.info('After sleep 4');
    execSync('sleep 60');
    logger.info('After sleep 5');
    execSync('sleep 60');
    logger.info('After sleep 6');
    execSync('sleep 60');
    logger.info('After sleep 7');
    execSync('sleep 60');
    logger.info('After sleep 8');
    execSync('sleep 60');
    logger.info('After sleep 9');
    execSync('sleep 60');
    logger.info('After sleep 10');
    execSync('sleep 60');
    logger.info('After sleep 11');
    execSync('sleep 60');
    logger.info('After sleep 12');
    execSync('sleep 60');
    logger.info('After sleep 13');
    execSync('sleep 60');
    logger.info('After sleep 14');
    execSync('sleep 60');
    logger.info('After sleep 15');
    execSync('sleep 60');
    logger.info('After sleep 16');
    execSync('sleep 60');
    logger.info('After sleep 17');
    execSync('sleep 60');
    logger.info('After sleep 18');
    execSync('sleep 60');
    logger.info('After sleep 19');
    execSync('sleep 60');
    logger.info('After sleep 20');
    execSync('sleep 60');
    logger.info('After sleep 21');
    execSync('sleep 60');
    logger.info('After sleep 22');
    execSync('sleep 60');
    logger.info('After sleep 23');
    execSync('sleep 60');
    logger.info('After sleep 24');
    execSync('sleep 60');
    logger.info('After sleep 25');
    execSync('sleep 60');
    logger.info('After sleep 26');
    execSync('sleep 60');
    logger.info('After sleep 27');
    execSync('sleep 60');
    logger.info('After sleep 28');
    execSync('sleep 60');
    logger.info('After sleep 29');
    execSync('sleep 60');
    logger.info('After sleep 30');*/

    await post(req, res);
    next();
  } catch (error) {
    logger.info('Error at job.route.js / -> ', error);
    next(error);
  }
});

export default jobRouter;
