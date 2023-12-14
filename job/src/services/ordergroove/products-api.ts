import { logger } from '../../utils/logger.utils';
import { OrdergrooveProduct } from '../../types/custom.types';
import { createUUID } from '../utils/data-helper';

const url = "https://staging.restapi.ordergroove.com/products-batch/create/?force_all_fields=false";
const headers = {
  'x-api-key': process.env.OG_API_KEY as string,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
const maxRetries = 2;

// Makes a second try if the first request fails
export const createProducts = async (products: Array<OrdergrooveProduct>, attemptCount?: number ) => {
  attemptCount = attemptCount === undefined ? 0 : attemptCount;

  if (attemptCount < maxRetries) {
    const executionId = createUUID();

    logger.info(`Starting the upload[${executionId}], products: ${JSON.stringify(products)}`);

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(products),
      headers
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`status ${response.status}`);
    })
    .then((data) => {
      logger.info(`Response data of upload[${executionId}]: ${JSON.stringify(data)}`);
    })
    .catch((error) => {
      logger.error(`Error in upload[${executionId}].`, error);
      attemptCount = attemptCount === undefined ? 1 : attemptCount++;
      setTimeout( () => createProducts(products, attemptCount), 1000);
    });
  }
}