import { ProductVariant } from '@commercetools/platform-sdk';

import { logger } from '../utils/logger.utils';
import { CtEventPayload, OrdergrooveProduct, OrdergrooveApiResponse } from '../types/custom.types';
import { createUUID } from './utils/data-utils';
import { retrieveOgProduct, updateProducts } from './client/og-products-api';
import { getProductVariantBySku } from './services/ct-service';
import { isProductOnStock } from './helpers/products-helper';


export const processInventoryEntryEvent = async (payload: CtEventPayload): Promise<boolean> => {
  const execution_id = createUUID();

  try {
    const sku = payload.resourceUserProvidedIdentifiers?.sku === undefined ? '' : payload.resourceUserProvidedIdentifiers?.sku;

    if (sku === '') {
      throw new Error(`Couldn't get the product sku asociated with this event: ${JSON.stringify(payload)}`);
    } else {
      const ogProductResponse: OrdergrooveApiResponse = await retrieveOgProduct(sku, execution_id);
      const ogProduct: OrdergrooveProduct | undefined = ogProductResponse.product;

      const ctProductVariant: ProductVariant = await getProductVariantBySku(sku);
      const isCtProductOnStock = isProductOnStock(ctProductVariant.availability);

      if (ogProduct !== undefined && ogProduct.live !== isCtProductOnStock) {
        ogProduct.live = isCtProductOnStock;
        const updProducts = new Array();
        updProducts.push(ogProduct);
        const ogUpdateResponse: OrdergrooveApiResponse = await updateProducts(updProducts, execution_id);

        if (!ogUpdateResponse.success && ogUpdateResponse.status === 500) {
          await updateProducts(updProducts, execution_id);
        }
      }
    }
  } catch (error) {
    logger.error(`An error occurred while processing[${execution_id}] the ${payload.type} event:`, error);
  }

  return true;
}