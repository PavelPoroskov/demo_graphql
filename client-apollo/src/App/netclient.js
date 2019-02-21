//import ApolloClientBoost from 'apollo-boost'
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split, Observable } from 'apollo-link';
//import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error';
import { getMainDefinition } from 'apollo-utilities'

import { getCurrentUserIdToken, setCurrentUserIdToken } from './userauth'

const getToken = () => {
  const {userToken} = getCurrentUserIdToken()
  return userToken
}

const request = async (operation) => {
  const userToken = getToken()
  if (userToken) {
    operation.setContext({
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
  }
}

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
})

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_SUBSCRIPTION_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: getToken(),
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  requestLink.concat(httpLink)
)

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    //httpLink, //++
    link,
  ]),
//  link,
//  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// //https://www.apollographql.com/docs/react/recipes/authentication.html#login-logout
// //Reset store on logout

// const client = new ApolloClientBoost({
//   //uri: 'http://localhost:4000'
//   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
//   // //use_coockie
//   // //credentials: 'same-origin', is active
//   // credentials: 'include',

//   // not use_coockie
//   request: async operation => {
//     const {userToken} = getCurrentUserIdToken()
//     if (userToken) {
//       operation.setContext({
//         headers: {
//           'Authorization': `Bearer ${userToken}`
//         }
//       });
//     }
//   },  
// });

export default {
  getCurrentUserIdToken,
  setCurrentUserIdToken,
  client,
}