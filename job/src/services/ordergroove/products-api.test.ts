import { jest } from '@jest/globals'

//jest.mock('node-fetch')
//import fetch from 'node-fetch';
//const {Response} = jest.requireActual('node-fetch');

import { createProducts } from './products-api'

jest.mock('./products-api', () => {
  return {
    createProducts: jest.fn()
  }
})

describe('createProducts', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should call the products-batch create API', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch')
    const mockResponse = { data: 'fake data' };

    jest.spyOn(global, 'fetch')

    await createProducts(
      [
        {
          "product_id": 'WFJS',
          "sku": 'WFJS',
          "name": 'Product WFJS',
          "price": 150.5,
          "live": true,
          "image_url": '',
          "detail_url": ''
        }
      ]
    )

    expect(createProducts).toHaveBeenCalledTimes(1)

    /*expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith('https://website.com/users', {
      method: 'POST',
    })*/
  })
})


