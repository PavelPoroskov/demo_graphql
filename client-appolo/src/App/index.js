//import React, { Component } from 'react';
import React from 'react';

import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost';

import LinkList from '../components/LinkList'
//import CreateLink from '../components/CreateLink'

import './App.css';

import { getCurrentUserIdToken, //setCurrentUserIdToken 
} from './userauth'


//https://www.apollographql.com/docs/react/recipes/authentication.html#login-logout
//Reset store on logout

const client = new ApolloClient({
  //uri: 'http://localhost:4000'
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
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

export default (props) => (
  <ApolloProvider client={client}>
    <LinkList />
  {/*
    <CreateLink />
  */}
  </ApolloProvider>
)
