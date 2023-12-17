import { Request, Response } from 'express';
import { CreatedBy, MessageDeliveryPayload, Order, ProductProjection } from '@commercetools/platform-sdk';

//import { createApiRoot } from '../client/create.client';
import CustomError from '../errors/custom.error';
import { logger } from '../utils/logger.utils';

export interface CtEventPayload extends MessageDeliveryPayload {
  notificationType: 'Message';
  projectKey: string;
  id: string;
  version: number;
  sequenceNumber: number;
  resource: {
    typeId: 'product' | 'order' | 'inventory-entry';
    id: string;
  };
  resourceVersion: number;
  type: 'ProductPublished' | 'OrderCreated' | 'InventoryEntryQuantitySet' | 'InventoryEntryDeleted' | 'InventoryEntryCreated';
  order?: Order;
  productProjection?: ProductProjection;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: CreatedBy;
  lastModifiedBy: CreatedBy;
}

/**
 * Exposed event POST endpoint.
 * Receives the Pub/Sub message and works with it
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (request: Request, response: Response) => {
  try {
    logger.info('>>> Controller request:', request);
    // Check request body
    if (!request.body) {
      logger.error('Missing request body.');
      throw new CustomError(400, 'Bad request: No Pub/Sub message was received');
    }

    // Check if the body comes in a message
    if (!request.body.message) {
      logger.error('Missing body message');
      throw new CustomError(400, 'Bad request: Wrong No Pub/Sub message format');
    }

    const message = JSON.parse('{"data": "eyJub3RpZmljYXRpb25UeXBlIjoiTWVzc2FnZSIsInByb2plY3RLZXkiOiJsdWNpbmEtY29ubmVjdCIsImlkIjoiOGU3NGUwNjMtYzg0Yy00OWQxLWI4YzUtZmViMzRkOGE1MTI4IiwidmVyc2lvbiI6MSwic2VxdWVuY2VOdW1iZXIiOjksInJlc291cmNlIjp7InR5cGVJZCI6InByb2R1Y3QiLCJpZCI6Ijk3NmE0NmE5LTk2ZDYtNGRiOS05YTRmLTk2NDQyNWU1N2YwYyJ9LCJyZXNvdXJjZVZlcnNpb24iOjksInJlc291cmNlVXNlclByb3ZpZGVkSWRlbnRpZmllcnMiOnsia2V5IjoiY29ja3RhaWwtc2hha2VyIiwic2x1ZyI6eyJlbi1HQiI6ImNvY2t0YWlsLXNoYWtlciIsImRlLURFIjoiY29ja3RhaWwtc2hha2VyIiwiZW4tVVMiOiJjb2NrdGFpbC1zaGFrZXIifX0sInR5cGUiOiJQcm9kdWN0UHVibGlzaGVkIiwicHJvZHVjdFByb2plY3Rpb24iOnsiaWQiOiI5NzZhNDZhOS05NmQ2LTRkYjktOWE0Zi05NjQ0MjVlNTdmMGMiLCJ2ZXJzaW9uIjo5LCJwcm9kdWN0VHlwZSI6eyJ0eXBlSWQiOiJwcm9kdWN0LXR5cGUiLCJpZCI6IjQ5NWQwM2I2LTdmZmMtNDU2Yy05NDdiLTAxYzdlNDg2MWIxMSJ9LCJuYW1lIjp7ImVuLVVTIjoiQ29ja3RhaWwgU2hha2VyIiwiZW4tR0IiOiJDb2NrdGFpbCBTaGFrZXIiLCJkZS1ERSI6IkNvY2t0YWlsIFNoYWtlciJ9LCJkZXNjcmlwdGlvbiI6eyJlbi1HQiI6IkEgY29ja3RhaWwgc2hha2VyIGlzIGEgdG9vbCB1c2VkIGluIG1peGluZyBhbmQgcHJlcGFyaW5nIGFsY29ob2xpYyBiZXZlcmFnZXMgc3VjaCBhcyBjb2NrdGFpbHMuIEl0IGlzIGEgbWV0YWwgY29udGFpbmVyIHdpdGggYSBsaWQgdGhhdCBzZWFscyB0aWdodGx5IHRvIHByZXZlbnQgc3BpbGxzLiBUaGUgY29udGFpbmVyIGhhcyBhIHRhcGVyZWQgc2hhcGUsIHdpdGggYSB3aWRlciBiYXNlIGFuZCBhIG5hcnJvd2VyIHRvcC4gVGhpcyBkZXNpZ24gYWxsb3dzIGZvciBlYXN5IG1peGluZyBvZiBpbmdyZWRpZW50cyBieSBzaGFraW5nIHRoZW0gdG9nZXRoZXIuIFRoZSBsaWQgaGFzIGEgYnVpbHQtaW4gc3RyYWluZXIgdG8gc2VwYXJhdGUgdGhlIGxpcXVpZCBmcm9tIHRoZSBpY2UgYW5kIG90aGVyIHNvbGlkIGluZ3JlZGllbnRzLiBUaGUgc2hha2VyIGlzIG1hZGUgb2Ygc3RhaW5sZXNzIHN0ZWVsLiIsImVuLVVTIjoiQSBjb2NrdGFpbCBzaGFrZXIgaXMgYSB0b29sIHVzZWQgaW4gbWl4aW5nIGFuZCBwcmVwYXJpbmcgYWxjb2hvbGljIGJldmVyYWdlcyBzdWNoIGFzIGNvY2t0YWlscy4gSXQgaXMgYSBtZXRhbCBjb250YWluZXIgd2l0aCBhIGxpZCB0aGF0IHNlYWxzIHRpZ2h0bHkgdG8gcHJldmVudCBzcGlsbHMuIFRoZSBjb250YWluZXIgaGFzIGEgdGFwZXJlZCBzaGFwZSwgd2l0aCBhIHdpZGVyIGJhc2UgYW5kIGEgbmFycm93ZXIgdG9wLiBUaGlzIGRlc2lnbiBhbGxvd3MgZm9yIGVhc3kgbWl4aW5nIG9mIGluZ3JlZGllbnRzIGJ5IHNoYWtpbmcgdGhlbSB0b2dldGhlci4gVGhlIGxpZCBoYXMgYSBidWlsdC1pbiBzdHJhaW5lciB0byBzZXBhcmF0ZSB0aGUgbGlxdWlkIGZyb20gdGhlIGljZSBhbmQgb3RoZXIgc29saWQgaW5ncmVkaWVudHMuIFRoZSBzaGFrZXIgaXMgbWFkZSBvZiBzdGFpbmxlc3Mgc3RlZWwuIiwiZGUtREUiOiJFaW4gQ29ja3RhaWxzaGFrZXIgaXN0IGVpbiBXZXJremV1ZywgZGFzIHp1bSBNaXNjaGVuIHVuZCBadWJlcmVpdGVuIHZvbiBhbGtvaG9saXNjaGVuIEdldHLDpG5rZW4gd2llIENvY2t0YWlscyB2ZXJ3ZW5kZXQgd2lyZC4gRXMgaXN0IGVpbiBNZXRhbGxiZWjDpGx0ZXIgbWl0IGVpbmVtIERlY2tlbCwgZGVyIGRpY2h0IGFic2NobGllw590LCB1bSBlaW4gVmVyc2Now7x0dGVuIHp1IHZlcmhpbmRlcm4uIERlciBCZWjDpGx0ZXIgaGF0IGVpbmUgc2ljaCB2ZXJqw7xuZ2VuZGUgRm9ybSBtaXQgZWluZXIgYnJlaXRlcmVuIEJhc2lzIHVuZCBlaW5lciBzY2htYWxlcmVuIE9iZXJzZWl0ZS4gRGllc2VzIERlc2lnbiBlcm3DtmdsaWNodCBlaW4gZWluZmFjaGVzIE1pc2NoZW4gZGVyIFp1dGF0ZW4gZHVyY2ggU2Now7x0dGVsbi4gRGVyIERlY2tlbCBoYXQgZWluIGVpbmdlYmF1dGVzIFNpZWIsIHVtIGRpZSBGbMO8c3NpZ2tlaXQgdm9tIEVpcyB1bmQgYW5kZXJlbiBmZXN0ZW4gWnV0YXRlbiB6dSB0cmVubmVuLiBNYXRlcmlhbDogRWRlbHN0YWjDtmwifSwiY2F0ZWdvcmllcyI6W3sidHlwZUlkIjoiY2F0ZWdvcnkiLCJpZCI6ImYyYzY0ZDNjLWEyNjktNDI0YS1iNzU4LTYxOTljZTVjZWZmYiJ9LHsidHlwZUlkIjoiY2F0ZWdvcnkiLCJpZCI6IjMxZDRiZmRlLWEwZjctNGI0NC04NDc3LWMyMTUwMWZkOTk4NyJ9LHsidHlwZUlkIjoiY2F0ZWdvcnkiLCJpZCI6IjY5YzUyOGMxLWJjNTQtNGQ0OC1iMDllLWIyZmFhNTU0NzNmMyJ9XSwiY2F0ZWdvcnlPcmRlckhpbnRzIjp7fSwic2x1ZyI6eyJlbi1HQiI6ImNvY2t0YWlsLXNoYWtlciIsImRlLURFIjoiY29ja3RhaWwtc2hha2VyIiwiZW4tVVMiOiJjb2NrdGFpbC1zaGFrZXIifSwibWFzdGVyVmFyaWFudCI6eyJpZCI6MSwic2t1IjoiQ09DVC0wOSIsInByaWNlcyI6W3siaWQiOiJlZDMzODYxZi1jNGQzLTQ5ZDctYWMyMC0zY2IzMmU4MzZjZmUiLCJ2YWx1ZSI6eyJ0eXBlIjoiY2VudFByZWNpc2lvbiIsImN1cnJlbmN5Q29kZSI6IkVVUiIsImNlbnRBbW91bnQiOjY5OSwiZnJhY3Rpb25EaWdpdHMiOjJ9LCJjb3VudHJ5IjoiREUifSx7ImlkIjoiNjlmY2MyOGUtZDJhMy00N2ZmLTlkOTUtYTA0OTZlNDdiM2FjIiwidmFsdWUiOnsidHlwZSI6ImNlbnRQcmVjaXNpb24iLCJjdXJyZW5jeUNvZGUiOiJHQlAiLCJjZW50QW1vdW50Ijo2OTksImZyYWN0aW9uRGlnaXRzIjoyfSwiY291bnRyeSI6IkdCIn0seyJpZCI6IjViZWZkZDM1LTQxNmQtNDJjMy04MTJmLTc0ODg5NGFhZjRmYiIsInZhbHVlIjp7InR5cGUiOiJjZW50UHJlY2lzaW9uIiwiY3VycmVuY3lDb2RlIjoiVVNEIiwiY2VudEFtb3VudCI6Njk5LCJmcmFjdGlvbkRpZ2l0cyI6Mn0sImNvdW50cnkiOiJVUyJ9XSwiaW1hZ2VzIjpbeyJ1cmwiOiJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vbWVyY2hhbnQtY2VudGVyLWV1cm9wZS9zYW1wbGUtZGF0YS9nb29kc3RvcmUvQ29ja3RhaWxfU2hha2VyLTEuMS5qcGVnIiwiZGltZW5zaW9ucyI6eyJ3IjozODUwLCJoIjo1NTAwfX0seyJ1cmwiOiJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vbWVyY2hhbnQtY2VudGVyLWV1cm9wZS9zYW1wbGUtZGF0YS9nb29kc3RvcmUvQ29ja3RhaWxfU2hha2VyLTEuMi5qcGVnIiwiZGltZW5zaW9ucyI6eyJ3Ijo1MDAwLCJoIjozNzUwfX1dLCJhdHRyaWJ1dGVzIjpbeyJuYW1lIjoicHJvZHVjdHNwZWMiLCJ2YWx1ZSI6eyJlbi1HQiI6Ii0gSW5jbHVkZXMgYnVpbHQgaW4gc3RyYWluZXJcbi0gU3RhaW5sZXNzIHN0ZWVsXG4tIERpc2h3YXNoZXIgc2FmZSIsImRlLURFIjoiLSBJbmtsdXNpdmUgZWluZ2ViYXV0ZW0gU2llYlxuLSBFZGVsc3RhaGxcbi0gU3DDvGxtYXNjaGluZW5mZXN0IiwiZW4tVVMiOiItIEluY2x1ZGVzIGJ1aWx0IGluIHN0cmFpbmVyXG4tIFN0YWlubGVzcyBzdGVlbFxuLSBEaXNod2FzaGVyIHNhZmUifX1dLCJhc3NldHMiOltdfSwidmFyaWFudHMiOltdLCJzZWFyY2hLZXl3b3JkcyI6e30sImhhc1N0YWdlZENoYW5nZXMiOmZhbHNlLCJwdWJsaXNoZWQiOnRydWUsImtleSI6ImNvY2t0YWlsLXNoYWtlciIsInRheENhdGVnb3J5Ijp7InR5cGVJZCI6InRheC1jYXRlZ29yeSIsImlkIjoiY2RiMDYwMWQtMmE1MC00ZGI4LWE3MTktNGEzMzdiN2RhMzg1In0sImNyZWF0ZWRBdCI6IjIwMjMtMTEtMjdUMTY6Mzc6NTMuMTcwWiIsImxhc3RNb2RpZmllZEF0IjoiMjAyMy0xMi0xN1QwMDoyNDoxMC4wNzZaIn0sInJlbW92ZWRJbWFnZVVybHMiOltdLCJzY29wZSI6IkFsbCIsImNyZWF0ZWRBdCI6IjIwMjMtMTItMTdUMDA6MjQ6MTAuMDc2WiIsImxhc3RNb2RpZmllZEF0IjoiMjAyMy0xMi0xN1QwMDoyNDoxMC4wNzZaIiwiY3JlYXRlZEJ5Ijp7ImlzUGxhdGZvcm1DbGllbnQiOnRydWUsInVzZXIiOnsidHlwZUlkIjoidXNlciIsImlkIjoiZTNhMjA0NjAtY2UxMS00ZjQ3LTllMDYtZjdlNzAzNjYwZDVlIn19LCJsYXN0TW9kaWZpZWRCeSI6eyJpc1BsYXRmb3JtQ2xpZW50Ijp0cnVlLCJ1c2VyIjp7InR5cGVJZCI6InVzZXIiLCJpZCI6ImUzYTIwNDYwLWNlMTEtNGY0Ny05ZTA2LWY3ZTcwMzY2MGQ1ZSJ9fX0=","messageId": "9868091263408156","message_id": "9868091263408156","publishTime": "2023-12-17T00:24:13.425Z","publish_time": "2023-12-17T00:24:13.425Z"}');
    const payload = JSON.parse(
      Buffer.from(message.data, 'base64').toString('utf8').trim()
    );
    logger.info('>>>>>>>>> Controller data decoded:', payload);

    // Return the response for the client
    response.status(200).send();
  } catch (error) {
    logger.info(`Event message error: ${(error as Error).message}`);
    response.status(400);
    response.send();
  }

  /*let customerId = undefined;



  // Receive the Pub/Sub message
  const pubSubMessage = request.body.message;

  // For our example we will use the customer id as a var
  // and the query the commercetools sdk with that info
  const decodedData = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
    : undefined;

  if (decodedData) {
    const jsonData = JSON.parse(decodedData);

    customerId = jsonData.customer.id;
  }

  if (!customerId) {
    throw new CustomError(
      400,
      'Bad request: No customer id in the Pub/Sub message'
    );
  }

  try {
    const customer = await createApiRoot()
      .customers()
      .withId({ ID: Buffer.from(customerId).toString() })
      .get()
      .execute();

    // Execute the tasks in need
    logger.info(customer);
  } catch (error) {
    throw new CustomError(400, `Bad request: ${error}`);
  }*/
};
