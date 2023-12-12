import { jest } from '@jest/globals'

import { addDecimalPointToCentAmount } from './data-helper';

describe('addDecimalPointToCentAmount', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

   it('should add the decimal point in the right place, test with 2 decimals', async () => {
    const priceResult = addDecimalPointToCentAmount(15050, 2);

     expect(priceResult).toBe(150.5);
  })

  it('should add the decimal point in the right place, test with 3 decimals', async () => {
    const priceResult = addDecimalPointToCentAmount(15050, 3);

     expect(priceResult).toBe(15.05);
  })
})