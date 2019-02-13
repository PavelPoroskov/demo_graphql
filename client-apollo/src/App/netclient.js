import ApolloClient from 'apollo-boost';

import { getCurrentUserIdToken, setCurrentUserIdToken } from './userauth'


//https://www.apollographql.com/docs/react/recipes/authentication.html#login-logout
//Reset store on logout

const client = new ApolloClient({
  //uri: 'http://localhost:4000'
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  // //use_coockie
  // //credentials: 'same-origin', is active
  // credentials: 'include',

  // not use_coockie
  request: async operation => {
    const {userToken} = getCurrentUserIdToken()
    if (userToken) {
      operation.setContext({
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
    }
  },  
});

export default {
  getCurrentUserIdToken,
  setCurrentUserIdToken,
  client,
}