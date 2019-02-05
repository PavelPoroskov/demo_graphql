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

export default compose(
  graphql(FEED_QUERY),
  WaitResult,
  withProps(({ data }) => ({
    data: data.feed.links
  }))  
)(LinkListView)


