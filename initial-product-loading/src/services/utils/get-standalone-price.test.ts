import { jest } from '@jest/globals'
import { StandalonePricePagedQueryResponse } from '@commercetools/platform-sdk'

import { getStandalonePriceBySkuAndCurrencyCode } from './get-standalone-price'
import * as standalonePricesApi from '../commercetools/standalone-prices-api'
import * as dataHelper from './data-helper'

const standalonePrices: StandalonePricePagedQueryResponse = {
  "limit": 1,
  "offset": 0,
  "count": 1,
  "total": 1,
  "results": [
    {
      "id": "a95a109f-b566-4081-a069-ab02bffc9f6c",
      "version": 1,
      "createdAt": "2023-12-10T15:36:49.007Z",
      "lastModifiedAt": "2023-12-10T15:36:49.007Z",
      "sku": "WFJM",
      "value": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 10000,
        "fractionDigits": 2
      },
      "active": true
    }
  ]
}

jest.mock('../commercetools/standalone-prices-api')
jest.mock('./data-helper')

describe('getStandalonePriceBySkuAndCurrencyCode', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

   it('should call the StandalonePrices API and the addDecimalPointToCentAmount() function', async () => {
    const queryStandalonePricesSpy = jest
      .spyOn(standalonePricesApi, 'queryStandalonePrices')
      .mockResolvedValue(standalonePrices)

    const addDecimalPointToCentAmount = jest
      .spyOn(dataHelper, 'addDecimalPointToCentAmount')

    const priceResult = await getStandalonePriceBySkuAndCurrencyCode('WFJM', 'USD')

    expect(queryStandalonePricesSpy).toHaveBeenCalled()
    expect(addDecimalPointToCentAmount).toHaveBeenCalled()
  })
})
