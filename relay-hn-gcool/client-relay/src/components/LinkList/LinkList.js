//import React, { Component } from "react";
import graphql from "babel-plugin-relay/macro";
import { createPaginationContainer } from "react-relay";

import View from './View'
//import { ITEMS_PER_PAGE } from '../../constants'

//let locCursor
      // fragment LinkList_viewer on Viewer 
      // @argumentDefinitions(
      //   count: {type: "Int", defaultValue: 2}
      //   after: {type: "String"}
      // )

export default createPaginationContainer( 
  View, 
  {
    viewer: graphql`
      fragment LinkList_viewer on Viewer @argumentDefinitions(
        count: {type: "Int!"}
        after: {type: "String"}
      )
      {
        allLinks(
          first: $count,
          after: $after,
          orderBy: createdAt_ASC
        ) @connection(key: "LinkList_allLinks") {
          edges {
            node {
              ...Link_link
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query LinkListForwardQuery(
        $count: Int!,
        $after: String
      ) {
        viewer {
          ...LinkList_viewer @arguments(count: $count, after: $after )
        }
      }
    `,
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.allLinks
    },
//return from this method effect nothing
//     getFragmentVariables(previousVariables, totalCount) {

//       console.log('paginations getFragmentVariables')
//       console.log(previousVariables)
// //      console.log(totalCount)
//       console.log(locCursor)

//       return {
//         ...previousVariables,
//         count: totalCount,
//       }
//       // return {
//       //    ...previousVariables,
//       //    after: locCursor,
//       //    //afterCursor: locCursor
//       // }
//       // return {
//       //   ...previousVariables,
//       //   count: 1,
//       // }
//       //return true
//     },
    getVariables(props, paginationInfo, fragmentVariables) {
      // console.log('paginations getVariables')
      // console.log(props)
      // console.log(paginationInfo)
      // console.log(fragmentVariables)

      //locCursor = paginationInfo.cursor
      return {
        count: paginationInfo.count,
//        count: 3,
        after: paginationInfo.cursor,
      }
    },
  }
);