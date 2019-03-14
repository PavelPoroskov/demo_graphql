import React from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'

import { useEffectPagination, useEffectSubscription } from '../../react-apollo-hooks'

import LinkListView from './View'

import { LINKS_PER_PAGE } from '../../utils'
//import netclient from '../../App/netclient'

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $after: String, $last: Int, $before: String, $orderBy: LinkOrderByInput) {
    feedConnection(first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy) @connection(key: "feed") {
      edges {
        node {
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`

// const NEW_LINKS_SUBSCRIPTION = gql`
//   subscription {
//     newLink {
//       id
//       createdAt
//       url
//       description
//       postedBy {
//         id
//         name
//       }
//       votes {
//         id
//         user {
//           id
//         }
//       }
//     }
//   }
// `

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
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
      user {
        id
      }
    }
  }
`

//console.log('FEED_QUERY')
//console.log(FEED_QUERY)

const hocWaitResult = (Component) => (props) => {
  //-- blink on next page
  // -> draw next page with wait (update page with timeout)
  //      draw prev page with fade
  //      option 1) new data recieved before timeout => draw page with new data
  //      option 2) timeout end => draw loading, after data recieved => draw page with new data

  const { loading, error, data,  ...rest } = props
  //const { loading, error, ...rest } = props

  if (loading) {
    //console.log(`hocWaitResult: loading`)
    return <div>Loading...</div>
  }
  if (error) {
    //console.log(`hocWaitResult: error`)
    return <div>{`Error: ${error}`}</div>
  }

  if (data) {
    //console.log(`hocWaitResult: result`)
    //console.log(data)
    //blink
    // hocWaitResult: result
    // []
    // hocWaitResult: result
    // [{…}, {…}, {…}]

    return <Component data={data} {...rest}/>
  }

  return null
  //return <Component {...rest}/>
  //return 'result'
}

const EnhancedLinkListView = hocWaitResult(LinkListView)

//https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.subscribe

const LinkList = (props) => {
  
//  const fnGetArray = (result) => result.data.feedConnection.edges

  const { hasPrevPage, goPrevPage, hasNextPage, goNextPage, totalBefore, ...rest } = useEffectPagination( props.client, FEED_QUERY, 
    {orderBy: 'createdAt_DESC'}, LINKS_PER_PAGE )

  useEffectSubscription( props.client, NEW_VOTES_SUBSCRIPTION )
  //rest = { loading, data, error }


  return (
    <React.Fragment >
      <EnhancedLinkListView {...rest} iTotal={totalBefore}/>
      <div className="flex ml4 mv3 gray">
        <div className={`navlink mr2 ${hasPrevPage?'navlink_available':''}`} onClick={goPrevPage}>
          Previous
        </div>
        <div className={`navlink ${hasNextPage?'navlink_available':''}`} onClick={goNextPage}>
          Next
        </div>
      </div>
    </React.Fragment>
  )
}

export default withApollo(LinkList)
