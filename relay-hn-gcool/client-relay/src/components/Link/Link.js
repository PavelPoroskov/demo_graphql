//import React, { Component } from "react";
import graphql from "babel-plugin-relay/macro";
import { createFragmentContainer } from "react-relay";

import View from './View'

export default createFragmentContainer( 
  View, 
  graphql`
    fragment Link_link on Link {
      id
      description
      url
    }
  `
);
