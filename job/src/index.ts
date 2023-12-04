import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';

// Import routes
import JobRoutes from './routes/job.route';

// Import logger
import { logger } from './utils/logger.utils';

import { readConfiguration } from './utils/config.utils';
import { errorMiddleware } from './middleware/error.middleware';

// Read env variables
readConfiguration();

const PORT = 8080;

// Create the express app
const app: Express = express();
app.disable('x-powered-by');

const ctpProjectKey = process.env.CTP_PROJECT_KEY as string;
const ogClientId = process.env.OG_CLIENT_ID as string;
const ogClientSecret = process.env.OG_CLIENT_SECRET as string;

logger.info('-> CTP_PROJECT_KEY:' + ctpProjectKey);
logger.info('-> OG_CLIENT_ID:' + ogClientId);
logger.info('-> OG_CLIENT_SECRET:' + ogClientSecret);

// Define routes
app.use('/job', JobRoutes);

// Global error handler
app.use(errorMiddleware);

// Listen the application
const server = app.listen(PORT, () => {
  logger.info(`⚡️ Job application listening on port ${PORT}`);
});

export default server;
