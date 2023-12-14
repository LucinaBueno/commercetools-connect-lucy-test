import { Request, Response } from 'express';

import CustomError from '../errors/custom.error';
import { logger } from '../utils/logger.utils';
import { uploadProducts } from '../services/upload-products';

/**
 * Exposed job endpoint.
 *
 * @param {Request} _request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (_request: Request, response: Response) => {
  try {
    let executeInitialUpload: boolean = _request.query.startUpload === undefined
        ? false : _request.query.startUpload === 'true' ? true : false;

    if (executeInitialUpload) {
      logger.info('>> Starting the initial products load from commercetools to ordergroove <<');
      await uploadProducts(100, 0);
    }

    response.status(200).send();
  } catch (error) {
    throw new CustomError(
      500,
      `Internal Server Error - Error uploading products to ordergroove, check the deployment logs for more information`
    );
  }
};
