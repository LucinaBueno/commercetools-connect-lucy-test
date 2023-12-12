import { logger } from '../../utils/logger.utils';
import { queryStandalonePrices } from '../commercetools/standalone-prices-api';
import { addDecimalPointToCentAmount } from './data-helper';

export const getStandalonePriceBySkuAndCurrencyCode = async (sku: string, currencyCode: string) => {
  let result = undefined;

  try {
    const whereArgs = `sku = "${sku}" and value(currencyCode="${currencyCode}")`;
    // Only a combination of SKU and currency code can exist for this type of price
    const standalonePrice = await queryStandalonePrices(whereArgs, 1, 0);

    if (standalonePrice.count > 0) {
      if (standalonePrice.results[0].active) {
        const centAmount = standalonePrice.results[0].value.centAmount;
        const fractionDigits = standalonePrice.results[0].value.fractionDigits;
        result = addDecimalPointToCentAmount(centAmount, fractionDigits);
      }
    }
  } catch (error) {
    logger.error(`Error getting StandalonePrice for sku ${sku}: `, error);
  }

  return result;
}