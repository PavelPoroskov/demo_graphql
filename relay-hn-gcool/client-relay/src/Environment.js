import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws'

import { GC_AUTH_TOKEN } from './constants'

async function fetchQuery(operation, variables) {
  const endpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT

  const response = await fetch( endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(GC_AUTH_TOKEN)}`
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  });
  return await response.json();
}

const setupSubscription = (operation, variables, cacheConfig, observer) => {
  const endpoint = process.env.REACT_APP_GRAPHQL_SUBSCRIPTION_ENDPOINT
  const query = operation.text

  const subscriptionClient = new SubscriptionClient( endpoint, {reconnect: true})
  // console.log('setupSubscription')
  // console.dir(subscriptionClient)

  // subscriptionClient.subscribe( {query, variables}, (error, result) => {
  //   observer.onNext({data: result})
  // })

  const { onNext, onError, onCompleted } = observer
  
  subscriptionClient
  .request({ query, variables })
  .subscribe( onNext, onError, onCompleted );
}

export default new Environment({
  network: Network.create( fetchQuery, setupSubscription ),
  store: new Store(new RecordSource())
});
