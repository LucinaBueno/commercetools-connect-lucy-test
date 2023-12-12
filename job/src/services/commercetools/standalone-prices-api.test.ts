import { jest } from '@jest/globals'

import { queryStandalonePrices } from './standalone-prices-api'
import { QueryArgs } from '../../types/index.types'

const standalonePrice = {
  "id": "a95a109f-b566-4081-a069-ab02bffc9f6c",
  "version": 1,
  "versionModifiedAt": "2023-12-10T15:36:49.007Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2023-12-10T15:36:49.007Z",
  "lastModifiedAt": "2023-12-10T15:36:49.007Z",
  "lastModifiedBy": {
    "clientId": "WyrVGQxli9PEb8nsycQ7O53o",
    "isPlatformClient": false
  },
  "createdBy": {
    "clientId": "WyrVGQxli9PEb8nsycQ7O53o",
    "isPlatformClient": false
  },
  "sku": "WFJM",
  "value": {
    "type": "centPrecision",
    "currencyCode": "USD",
    "centAmount": 10000,
    "fractionDigits": 2
  },
  "active": true
}

const mockedExecute = jest.fn().mockReturnValue({ body: standalonePrice })
const mockedPost = jest.fn().mockReturnValue({
  execute: jest.fn()
})

jest.mock('../../client/create.client', () => {
  return {
    createApiRoot: jest.fn().mockImplementation(() => ({
      standalonePrices: jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({
          execute: mockedExecute
        }),
        post: mockedPost
      })
    }))
  }
})

describe('queryStandalonePrices', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should call the Commercetools API with the correct parameters', async () => {
    const whereArgs = 'sku = "WFJM"' as unknown as string
    const limit = 100 as unknown as number
    const offset = 0 as unknown as number

    await queryStandalonePrices(whereArgs, limit, offset)

    expect(mockedExecute).toHaveBeenCalledTimes(1)
    expect(mockedExecute).toHaveReturned()
    expect(mockedExecute).toHaveReturnedWith({"body": standalonePrice})
  })
})