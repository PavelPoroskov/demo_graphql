//import React, { Component } from "react";
import graphql from "babel-plugin-relay/macro";
import { createFragmentContainer } from "react-relay";

import View from './View'

export default createFragmentContainer( 
  View, 
  graphql`
    fragment LinkList_viewer on Viewer {
      allLinks(last: 100, orderBy: id_ASC) @connection(key: "LinkList_allLinks", filters: []) {
        edges {
          node {
            ...Link_link
          }
        }
      }
    }
  `
);