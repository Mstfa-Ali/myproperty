/**
 * Handles an HTTP request and returns a response.
 *
 * @async
 * @param {Request} request - Represents the incoming request.
 * @param {Object} context - Provides additional information about the request and environment.
 * @param {Object} context.client - The client's network information.
 * @param {Object} context.device - The client's device capabilities.
 * @param {Object} context.environmentVars - Environment variables as defined in the Developer Console.
 * @param {Object} context.geo - The client's geo location.
 * @param {Object} context.metrics - Provides functions for injecting metrics into your edge function.
 * @param {Function} context.metrics.add - Adds a value to the metric with the given ID.
 * @param {Function} context.metrics.startTimer - Starts a timer for the metric with the given ID. Only one timer can be active at a time for a given metric ID.
 * @param {Function} context.metrics.stopTimer - Stops a timer for the metric with the given ID.
 * @param {Object} context.origins - Origin servers as defined in the {{ PORTAL }} or the {{ CONFIG_FILE }} file.
 * @param {Object} context.requestVars - Information about this property including values set using Set Variables.
 * @returns {Response | Promise<Response>}
 */
import { connect } from '@planetscale/database';

// polyfill required classes for Planetscale
import '../../../utils/polyfills/Buffer';
import '../../../utils/polyfills/URL';

import createFetchForOrigin from '../../../utils/createFetchForOrigin';

const fetch = createFetchForOrigin('planetscale');


export async function handleHttpRequest(request, context) {
  
  const { environmentVars: env } = context;

  const config = {
    host: 'aws.connect.psdb.cloud',
    username: env.PLANETSCALE_USERNAME,
    password: env.PLANETSCALE_PASSWORD,
    fetch,
    
  };

  const conn = connect(config);

  const results = await conn.transaction(async (tx) => {
    await tx.execute('INSERT INTO example_table () VALUES ();');
    return await tx.execute('SELECT COUNT(*) as total FROM example_table;');
  });
  const totalCount = results.rows[0].total;
  // Add the customer's postal_code to the json response
  const body = context.client.dst_addr+"-----"+totalCount;
    
  
  //const jsonBody = JSON.stringify(body);

  
  
  return new Response(body);
}
