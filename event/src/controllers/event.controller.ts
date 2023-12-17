import { Request, Response } from 'express';
import { CreatedBy, MessageDeliveryPayload, Order, ProductProjection } from '@commercetools/platform-sdk';

import { createApiRoot } from '../client/create.client';
import CustomError from '../errors/custom.error';
import { logger } from '../utils/logger.utils';

export interface CtEventPayload extends MessageDeliveryPayload {
  notificationType: 'Message';
  projectKey: string;
  id: string;
  version: number;
  sequenceNumber: number;
  resource: {
    typeId: 'product' | 'order' | 'inventory-entry';
    id: string;
  };
  resourceVersion: number;
  type: 'ProductPublished' | 'OrderCreated' | 'InventoryEntryQuantitySet' | 'InventoryEntryDeleted' | 'InventoryEntryCreated';
  order?: Order;
  productProjection?: ProductProjection;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: CreatedBy;
  lastModifiedBy: CreatedBy;
}

/**
 * Exposed event POST endpoint.
 * Receives the Pub/Sub message and works with it
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (request: Request, response: Response) => {
  logger.info('>>>>>>>>> Controller request:', request);
  logger.info('>>>>>>>>> Controller request.body:', request.body);
  logger.info('>>>>>>>>> Controller request.body.message:', request.body.message);

  const payload: CtEventPayload = JSON.parse(
    Buffer.from(request.body.message.data, 'base64').toString('utf8')
  ).data;
  logger.info('>>>>>>>>> Controller payload:', payload);

  let customerId = undefined;

  // Check request body
  if (!request.body) {
    logger.error('Missing request body.');
    throw new CustomError(400, 'Bad request: No Pub/Sub message was received');
  }

  // Check if the body comes in a message
  if (!request.body.message) {
    logger.error('Missing body message');
    throw new CustomError(400, 'Bad request: Wrong No Pub/Sub message format');
  }

  // Receive the Pub/Sub message
  const pubSubMessage = request.body.message;

  // For our example we will use the customer id as a var
  // and the query the commercetools sdk with that info
  const decodedData = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
    : undefined;

  if (decodedData) {
    const jsonData = JSON.parse(decodedData);

    customerId = jsonData.customer.id;
  }

  if (!customerId) {
    throw new CustomError(
      400,
      'Bad request: No customer id in the Pub/Sub message'
    );
  }

  try {
    const customer = await createApiRoot()
      .customers()
      .withId({ ID: Buffer.from(customerId).toString() })
      .get()
      .execute();

    // Execute the tasks in need
    logger.info(customer);
  } catch (error) {
    throw new CustomError(400, `Bad request: ${error}`);
  }

  // Return the response for the client
  response.status(204).send();
};
