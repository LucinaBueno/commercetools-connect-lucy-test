import { logger } from '../utils/logger.utils';
import { CtEventPayload, OrdergrooveProduct, OrdergrooveApiResponse } from '../types/custom.types';
import { extractProductVariants } from './helpers/products-helper';
import { retrieveOgProduct, createProducts, updateProducts } from './ordergroove/og-products-api';
import { createUUID } from './utils/data-utils';

export const processEventProductPublished = async (payload : CtEventPayload) : Promise<boolean> => {
  try {
    const ctProducts: OrdergrooveProduct[] = await extractProductVariants(payload);

    for (let i = 0; i < ctProducts.length; i++) {
      const ctProduct: OrdergrooveProduct = ctProducts[i];
      const execution_id = createUUID();
      const ogRetrieveResponse: OrdergrooveApiResponse = await retrieveOgProduct(ctProduct.product_id, execution_id);

      console.log('>>>>>>>>>>>>');
      logger.info('Product in ct:', ctProduct);
      console.log('Product in og:', ogRetrieveResponse);

      if (ogRetrieveResponse.product === undefined) {
        const newProducts = new Array();
        newProducts.push(ctProduct);
        const ogCreateResponse = await createProducts(newProducts, execution_id);

        // Retry one more time
        if (!ogCreateResponse.success && (ogCreateResponse.status === 500)) {
          await createProducts(newProducts, execution_id);
        }
      } else {
        if (JSON.stringify(ctProduct) !== JSON.stringify(ogRetrieveResponse.product)) {
          const updProducts = new Array();
          updProducts.push(ctProduct);
          const ogUpdateResponse = await updateProducts(updProducts, execution_id);

          // Retry one more time
          if (!ogUpdateResponse.success && (ogUpdateResponse.status === 500)) {
            await updateProducts(updProducts, execution_id);
          }
        }
      }
    }
  } catch (error) {
    logger.error('Error processing the event received (ProductPublished).', error);
  }

  return true;
}