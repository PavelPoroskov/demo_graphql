import React, { Component } from 'react'
import { QueryRenderer } from 'react-relay'
import graphql from "babel-plugin-relay/macro";
import environment from '../../Environment'

import LinkList from '../LinkList'

export default
class LinkListPage extends Component {

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query LinkListPageQuery {
            viewer {
              ...LinkList_viewer
            }
          }
        `}
        render={({error, props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <LinkList viewer={props.viewer} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }

}