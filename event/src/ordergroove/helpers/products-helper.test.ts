import { jest } from '@jest/globals'

import { extractProductVariants } from './products-helper'
import { mockProductCtEventPayload } from '../../mocks/mocks'

jest.mock('../utils/data-utils')
jest.mock('./products-helper', () => {
  return {
    extractProductVariants: jest.fn()
  }
})

describe('extractProductVariants', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should process the products', async () => {
    await extractProductVariants(mockProductCtEventPayload)

    expect(extractProductVariants).toHaveBeenCalled
  })
})