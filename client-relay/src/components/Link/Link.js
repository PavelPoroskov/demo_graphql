//import React, { Component } from "react";
import graphql from "babel-plugin-relay/macro";
import { createFragmentContainer } from "react-relay";

import ConnectedView from "./Connect";

export default createFragmentContainer(ConnectedView, {
  link: graphql`
    fragment Link_link on Link {
      id
      description
      url
      createdAt
      postedBy {
        id
        name
      }
      votes {
        count
      }
    }
  `
});
