//import React, { Component } from 'react';
import React from 'react';

import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost';

import LinkList from '../components/LinkList'

import './App.css';


const client = new ApolloClient({
  //uri: 'http://localhost:4000'
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
});

export default (props) => (
  <ApolloProvider client={client}>
    <LinkList />
  </ApolloProvider>
)
