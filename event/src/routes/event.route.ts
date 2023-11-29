import { Router } from 'express';

import { logger } from '../utils/logger.utils';

const eventRouter: Router = Router();

eventRouter.post('/', async (req, res) => {
  //logger.info('Event message received...');
  logger.info('-> Event request:', req);

  const ctpProjectKey = process.env.CTP_PROJECT_KEY as string;
  const ogClientId = process.env.OG_CLIENT_ID as string;
  const ogClientSecret = process.env.OG_CLIENT_SECRET as string;

  logger.info('-> CTP_PROJECT_KEY:' + ctpProjectKey);
  logger.info('-> OG_CLIENT_ID:' + ogClientId);
  logger.info('-> OG_CLIENT_SECRET:' + ogClientSecret);


  const { body } = req;

  if (body.message !== undefined && body.message.data !== undefined) {
    const encodedData = body.message.data;

    let buff = new Buffer(encodedData, 'base64');
    let decodedData = buff.toString('ascii');

    console.log('-> Decoded event data:', decodedData);

  } else {
    console.log('-> There is not data for this event!');
  }

  res.status(200);
  res.send();
});

export default eventRouter;
