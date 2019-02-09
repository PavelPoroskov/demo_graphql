import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withProps } from 'recompose'

import WaitResult from '../WaitResult'
import LinkListView from './View'


export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }        
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


