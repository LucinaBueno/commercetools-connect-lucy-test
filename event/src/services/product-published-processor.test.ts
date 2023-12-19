import { jest } from '@jest/globals'

import { processEventProductPublished } from './product-published-processor'
import * as ProductPublishedProcessor from './product-published-processor'
import * as ProductsHelper from './helpers/products-helper'
import { retrieveOgProduct, createProducts, updateProducts } from './ordergroove/og-products-api'
import * as OgProductsApi from './ordergroove/og-products-api'
import { mockOgProductApiResponse, mockOgProducts, mockProductCtEventPayload } from '../mocks/mocks'

jest.mock('./helpers/products-helper', () => {
  return {
    extractProductVariants: jest.fn()
  }
})
jest.mock('./ordergroove/og-products-api', () => {
  return {
    retrieveOgProduct: jest.fn().mockReturnValue(
      {
        success: true,
        status: 200,
        product: {
          product_id: 'ABC123',
          sku: 'ABC123',
          name: 'Test Product',
          price: 100,
          live: true,
          image_url: 'https://image-url.com',
          detail_url: ''
        }
      }
    ),
    createProducts: jest.fn().mockReturnValue(
      {
        success: true,
        status: 200
      }
    ),
    updateProducts: jest.fn().mockReturnValue(
      {
        success: true,
        status: 200
      }
    ),
  }
})


describe('processEventProductPublished', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should call the Retrieve product API in ordergroove', async () => {
    const processEventProductPublishedSpy = jest
      .spyOn(ProductPublishedProcessor, 'processEventProductPublished')

    const extractProductVariantsSpy = jest
      .spyOn(ProductsHelper, 'extractProductVariants')
      .mockImplementation(() => Promise.resolve(mockOgProducts))
      .mockResolvedValue(mockOgProducts)

    const retrieveOgProductSpy = jest
      .spyOn(OgProductsApi, 'retrieveOgProduct')
      .mockImplementation(() => Promise.resolve(mockOgProductApiResponse))
      .mockResolvedValue(mockOgProductApiResponse)
    
    const createProductsSpy = jest
      .spyOn(OgProductsApi, 'createProducts')
      .mockImplementation(() => Promise.resolve(mockOgProductApiResponse))
      .mockResolvedValue(mockOgProductApiResponse)
    
    /*const updateProductsSpy = jest
      .spyOn(OgProductsApi, 'updateProducts')
      .mockImplementation(() => Promise.resolve(mockOgProductApiResponse))
      .mockResolvedValue(mockOgProductApiResponse)*/

    const result = await processEventProductPublished(mockProductCtEventPayload)

    expect(processEventProductPublished).toHaveBeenCalled()
    expect(extractProductVariantsSpy).toHaveBeenCalled()
  })
})