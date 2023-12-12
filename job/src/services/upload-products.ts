import { logger } from '../utils/logger.utils';
import { getProductProjections } from './commercetools/products-api';
import { extractProductVariants } from './utils/extract-product-variants';

export const uploadProducts = async (limitQuery: number, offsetQuery: number, executeNext?: boolean) => {
  try {
    console.log(`-->> upload products query: ${limitQuery} - ${offsetQuery}`);
    executeNext = executeNext ? executeNext : true;

    if (executeNext) {
      const productProjectionPagedQueryResponse = await getProductProjections({ limit: limitQuery, offset: offsetQuery });
      const { limit, count, offset } = productProjectionPagedQueryResponse;
      const total = productProjectionPagedQueryResponse.total === undefined ? 0 : productProjectionPagedQueryResponse.total;

      const allProductVariants = await extractProductVariants(productProjectionPagedQueryResponse);

      // TODO: Make batches of 100 products and send then to og

      const totalProductsRequested = offset + count;
      console.log(`-->> upload products, total requested: ${totalProductsRequested} of a total of ${total}`);
      if (totalProductsRequested < total) {
        offsetQuery = offsetQuery + 100;
        await uploadProducts(limitQuery, offsetQuery, true);
      }
    }
  } catch (error) {
    logger.error('Error at uploading products', error);
  }

}