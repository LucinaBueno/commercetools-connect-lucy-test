import { logger } from '../utils/logger.utils';
import { getProductProjections } from './commercetools/products-api';
import { extractProductVariants } from './utils/extract-product-variants';
import { createProducts } from './ordergroove/products-api';
import { OrdergrooveProduct } from '../types/custom.types';

export const uploadProducts = async (limitQuery: number, offsetQuery: number, executeNext?: boolean, totalProductVariants?: number) => {
  try {
    logger.info(`Get product-projections from commercetools: limit:${limitQuery} - offset:${offsetQuery}`);
    executeNext = executeNext ? executeNext : true;
    totalProductVariants = totalProductVariants ? totalProductVariants : 0;

    if (executeNext) {
      const productProjectionPagedQueryResponse = await getProductProjections({ limit: limitQuery, offset: offsetQuery });
      const { limit, count, offset } = productProjectionPagedQueryResponse;
      const total = productProjectionPagedQueryResponse.total === undefined ? 0 : productProjectionPagedQueryResponse.total;

      const allProductVariants: OrdergrooveProduct[] =
          await extractProductVariants(productProjectionPagedQueryResponse);

      totalProductVariants = totalProductVariants + allProductVariants.length;

      await sendProductsToOrdergroove(allProductVariants);

      const totalProductsRequested = offset + count;
      logger.info(`Products retrieved from commercetools: ${totalProductsRequested} of a total of ${total}`);
      if (totalProductsRequested < total) {
        offsetQuery = offsetQuery + 100;
        await uploadProducts(limitQuery, offsetQuery, true, totalProductVariants);
      } else {
        logger.info(`>> The products upload process from commercetools to ordergroove has finished with a total of ${totalProductVariants} product variants processed <<`);
      }
    }
  } catch (error) {
    logger.error('Error at uploading products', error);
    // TODO: Definir si se trunca el proceso
    throw error;
  }
}

async function sendProductsToOrdergroove(products: Array<OrdergrooveProduct>) {
  const numberOfBatches = Math.ceil((products.length / 100));
  logger.info(`Preparing ${numberOfBatches} batches for sending to ordergroove`);

  // limit to 10 batches/second (Requests are throttled at 600req/min)
  if (numberOfBatches <= 10) {
    await setPromiseAllToSendBatches(products, numberOfBatches, 0);
  } else {
    const numberOfPromisesAll = Math.ceil((numberOfBatches / 10));

    let startIndex = 0;
    let numberOfBatchesToSend = 10;
    let numberOfBatchesLeft = numberOfBatches;
    for (let i = 0; i < numberOfPromisesAll; i++) {
      if (numberOfBatchesLeft > 10) {
        await setPromiseAllToSendBatches(products, numberOfBatchesToSend, 0);
        numberOfBatchesLeft = numberOfBatchesLeft - numberOfBatchesToSend;
        startIndex = startIndex + 1000;
      } else {
        await setPromiseAllToSendBatches(products, numberOfBatchesLeft, startIndex);
      }
    }
  }
}

async function setPromiseAllToSendBatches(products: Array<OrdergrooveProduct>, numberOfBatches: number, startIndex: number) {
  const batchesList = new Array();
  let finishIndex = startIndex + 100;
  for (let x = 0; x < numberOfBatches; x++) {
    batchesList.push(products.slice(startIndex, finishIndex));
    startIndex = finishIndex;
    finishIndex = finishIndex + 100;
  }

  logger.info(`Setting up promise.all to send ${numberOfBatches} batches of products to ordergroove`);
  await Promise.all(
    batchesList.map(async batch => {
      createProducts(batch);
    })
  );
}