//import React from 'react'
//import { Query } from 'react-apollo'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withProps } from 'recompose'

import WaitResult from '../WaitResult'
import LinkListView from './View'


const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

// export default (props) => (
//   <Query query={FEED_QUERY}>
//     {({ loading, error, data }) => {
//       if (loading) return <div>Fetching</div>
//       if (error) return <div>Error</div>

//       return <LinkListView list={data.feed.links} />
//     }}
//   </Query>
// )

export default compose(
  graphql(FEED_QUERY),
  WaitResult,
  withProps(({ data }) => ({
    data: data.feed.links
  }))  
)(LinkListView)
