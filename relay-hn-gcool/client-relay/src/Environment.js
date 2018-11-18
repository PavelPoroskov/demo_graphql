/**
 * This file configures the Environment to use with the example app.
 * It configures how to send a GraphQL request and a standard Store used
 * to store records.
 */

import { Environment, Network, RecordSource, Store } from 'relay-runtime';

async function fetchQuery(operation, variables) {
  const endpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT

  const response = await fetch( endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  });
  return await response.json();
}

export default new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});
