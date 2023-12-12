import { createApiRoot } from '../../client/create.client';

export const queryStandalonePrices = async (whereArgs: string, limit: number, offset: number) => {
  const { body } = await createApiRoot()
    .standalonePrices()
    .get({
      queryArgs: {
          where : whereArgs,
          limit: limit,
          offset: offset
      }
    }).execute();

  return body;
};

