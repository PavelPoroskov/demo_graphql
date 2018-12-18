import React, { Component } from 'react'
import { QueryRenderer } from 'react-relay'
import graphql from "babel-plugin-relay/macro";
import environment from '../../Environment'

import LinkList from '../LinkList'
import { ITEMS_PER_PAGE } from '../../constants'

export default
class LinkListPage extends Component {

  // dataFrom = 'NETWORK_ONLY' // default
  // //dataFrom = 'STORE_THEN_NETWORK'
  //       dataFrom={this.dataFrom}
  //     />

  variables = { 
    count: ITEMS_PER_PAGE,
    filter: null
  }

  render() {

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query LinkListPageQuery (
            $count: Int!,
            $after: String
          ){
            viewer {
              ...LinkList_viewer @arguments(count: $count, after: $after)
            }
          }
        `}
        variables={this.variables}
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