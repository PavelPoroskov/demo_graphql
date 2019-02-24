import React, {useState} from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'

import { useEffectApolloQuery } from './react-apollo-hooks'

import LinkListView from './View'

const LINKS_PER_PAGE = 2

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $after: String, $last: Int, $before: String, $orderBy: LinkOrderByInput) {
    feedConnection(first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy) {
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

// const NEW_VOTES_SUBSCRIPTION = gql`
//   subscription {
//     newVote {
//       id
//       link {
//         id
//         url
//         description
//         createdAt
//         postedBy {
//           id
//           name
//         }
//         votes {
//           id
//           user {
//             id
//           }
//         }
//       }
//       user {
//         id
//       }
//     }
//   }
// `

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
    return <Component data={data} {...rest}/>
  }

  return null
  //return <Component {...rest}/>
  //return 'result'
}

const EnhancedLinkListView = hocWaitResult(LinkListView)

//https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.subscribe

let nPage = 1

const LinkList = (props) => {
  
  const [cursorAfter, setCursorAfter] = useState(null)
  const [cursorBefore, setCursorBefore] = useState(null)
  const [isForward, setIsForward] = useState(true)

  //const nPage = parseInt(props.match.params.page, 10)
  let queryVariables = {
    //skip: (iPage - 1) * LINKS_PER_PAGE,
    orderBy: 'createdAt_ASC'
  }
  if (isForward) {
    queryVariables['first'] = LINKS_PER_PAGE
    queryVariables['after'] = cursorAfter
  } else {
    queryVariables['last'] = LINKS_PER_PAGE
    queryVariables['before'] = cursorBefore
  }

  //{ loading, error, data } = 
  const propsLoading = useEffectApolloQuery( props.client, FEED_QUERY, 
    queryVariables, 
    (result) => result.data.feedConnection, 
    [ 
      // {
      //   query: NEW_VOTES_SUBSCRIPTION
      //   //fnToChache
      //   //dont need fnToCache(). Perhaps result = {data: {newVote: {link: {id, votes}}}}
      //   // link: {id, votes} go to cache auto?
      // },
      // {
      //   query: NEW_LINKS_SUBSCRIPTION,
      //   //need fnToCache(), result = {data:{ newLink: {id,...} }
      //   fnToCache: result => {
      //     // console.log('fnToChache')
      //     // console.log(props)
      //     const data = props.client.readQuery({ query: FEED_QUERY, variables: queryVariables })

      //     data.feed.links.push(result.data.newLink)

      //     props.client.writeQuery({ query: FEED_QUERY, data, variables: queryVariables })
      //   }
      // },
    ] 
  )

  const _nextPage = () => {
    if (propsLoading.data) {
      const pgi = propsLoading.data.pageInfo
      if (pgi.hasNextPage) {
        setIsForward(true)
        setCursorAfter(pgi.endCursor)
        setCursorBefore(null)
        nPage = nPage + 1
      }
    }
    // let ar = propsLoading.data
    // if (ar && Array.isArray(ar) && 0 < ar.length) {
    //   setAfter(ar[ar.length-1].id)
    // }
  }
  const _previousPage = () => {
    if (propsLoading.data) {
      const pgi = propsLoading.data.pageInfo
//      if (data.hasPreviousPage) {
      if (1 < nPage || pgi.hasPreviousPage) {
        setIsForward(false)
        setCursorAfter(null)
        setCursorBefore(pgi.startCursor)
        nPage = nPage - 1
      }
    }
    // if (1 < nPage) {
    //   const previousPage = nPage - 1
    //   this.props.history.push(`/page/${previousPage}`)
    // }
  }

  let newData = null
  if (propsLoading.data) {
    newData = propsLoading.data.edges.map( o => o.node )
  }
  const iTotal = (nPage - 1)*LINKS_PER_PAGE

  return (
    <React.Fragment >
      <EnhancedLinkListView {...propsLoading} data={newData} iTotal={iTotal}/>
      <div className="flex ml4 mv3 gray">
        <div className="pointer mr2" onClick={_previousPage}>
          Previous
        </div>
        <div className="pointer" onClick={_nextPage}>
          Next
        </div>
      </div>
    </React.Fragment>
  )
}

export default withApollo(LinkList)

//experience: pagination
//)load first page with first=2, after=null
//)press NextPage, load next(second) page with first=2 after=pageInfo.endCursor
//  after pageInfo.hasPreviousPage=false?!

// hasPreviousPage make sense only after one goPrevPage( last=2, before=dfdfdfd)
