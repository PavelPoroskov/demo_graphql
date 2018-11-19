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
            console.log('QueryRenderer render: error')
            return <div>{error.message}</div>
          } else if (props) {
            console.log('QueryRenderer render: props')
            return <LinkList viewer={props.viewer} />
          }
          
          console.log('QueryRenderer render: Loading')
          return <div>Loading</div>
        }}
      />
    )
  }

}