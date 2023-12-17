import { Router } from 'express';

import { logger } from '../utils/logger.utils';
import { post } from '../controllers/event.controller';

const eventRouter: Router = Router();

eventRouter.post('/', post);

/*eventRouter.post('/', async (req, res) => {
  //logger.info('-> Event request router:', req);

  const { body } = req;

  //console.log(body);

  if (body.message !== undefined && body.message.data !== undefined) {
    const encodedData = body.message.data;

    const decodedData = Buffer.from(encodedData, 'base64').toString('utf8');

    console.log('-> Decoded event data:', decodedData);

  } else {
    console.log('-> There is not data for this event!');
  }

  await post(req, res);

  res.status(200);
  res.send();
});*/

export default eventRouter;
