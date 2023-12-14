import { jest } from '@jest/globals'

import { addDecimalPointToCentAmount, createUUID } from './data-helper';

/*jest.mock('./data-helper', () => {
  return {
    createUUID: jest.fn().mockReturnValue('asdb-1234-asdad-12313-asdad')
  }
})*/

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

  it('should add the decimal point in the right place, test with 4 decimals', async () => {
      const priceResult = addDecimalPointToCentAmount(456789, 4);

       expect(priceResult).toBe(45.6789);
    })
})

describe('createUUID', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

   it('should return an UUID', async () => {
    const uuid = createUUID();

     expect(uuid).toBeDefined();
  })
})