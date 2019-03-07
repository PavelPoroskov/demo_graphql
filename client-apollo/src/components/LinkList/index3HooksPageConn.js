import React, {useState, useRef} from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'

import { useEffectApolloConnection } from './react-apollo-hooks'

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
    console.log(`hocWaitResult: loading`)
    return <div>Loading...</div>
  }
  if (error) {
    console.log(`hocWaitResult: error`)
    return <div>{`Error: ${error}`}</div>
  }

  if (data) {
    console.log(`hocWaitResult: result`)
    console.log(data)
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
  
  const [cursorAfter, setCursorAfter] = useState(null)
  //const [cursorBefore, setCursorBefore] = useState(null)
  const [isForward, setIsForward] = useState(true)

  const refPrevPageIndex = useRef(0)
  const refPageIndex = useRef(0)
  //const [refPageIndex.current, setPageIndex] = useState(0)
  const refPrevCursorAfter = useRef([null])

  //const nPage = parseInt(props.match.params.page, 10)
  let queryVariables = {
    //skip: (iPage - 1) * LINKS_PER_PAGE,
    orderBy: 'createdAt_DESC',
    first: LINKS_PER_PAGE,
    after: cursorAfter
  }
  // if (isForward) {
  //   queryVariables['first'] = LINKS_PER_PAGE
  //   queryVariables['after'] = cursorAfter
  // } else {
  //   queryVariables['last'] = LINKS_PER_PAGE
  //   queryVariables['before'] = cursorBefore
  // }

  //{ loading, error, data } = 
  const propsLoading = useEffectApolloConnection( props.client, FEED_QUERY, 
    queryVariables, 
    (result) => result.data.feedConnection
  )

  const _nextPage = () => {
    if (propsLoading.data) {
      const pgi = propsLoading.data.pageInfo
//      if ((isForward && pgi.hasNextPage) || !isForward ) {
      if ((isForward && pgi.hasNextPage) || (refPageIndex.current < refPrevCursorAfter.current.length-1) ) {
        setIsForward(true)
        refPrevPageIndex.current = refPageIndex.current
        refPageIndex.current = refPageIndex.current + 1

        if (refPrevCursorAfter.current.length <= refPageIndex.current ) {
          refPrevCursorAfter.current.push(pgi.endCursor)
        }
        setCursorAfter(refPrevCursorAfter.current[refPageIndex.current])

        console.log('nextPage')
        // console.log(refPrevCursorAfter.current)
      }
    }
  }
  const _previousPage = () => {
    if (propsLoading.data) {
//      const pgi = propsLoading.data.pageInfo
//      if (data.hasPreviousPage) {
//      if (1 < nPage || pgi.hasPreviousPage) {
//      if ((!isForward && pgi.hasPreviousPage) || (isForward && 0 < refPageIndex.current) ) {
      if (0 < refPageIndex.current) {
        setIsForward(false)

        // setCursorAfter(null)
        // setCursorBefore(pgi.startCursor)

        // let prevCursor = refPrevCursorAfter.current.pop()
        // prevCursor = refPrevCursorAfter.current.slice(-1)[0]

        refPrevPageIndex.current = refPageIndex.current
        refPageIndex.current = refPageIndex.current - 1
        setCursorAfter(refPrevCursorAfter.current[refPageIndex.current])

        // console.log('prevPage')
        // console.log(refPrevCursorAfter.current)

        //setPageIndex(refPageIndex.current - 1)
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
    //const rest = newData.length % LINKS_PER_PAGE
    //newData = newData.slice( rest ? -rest: -LINKS_PER_PAGE )

    //-- blinks on render for new batch
    //newData = newData.slice( refPageIndex.current*LINKS_PER_PAGE, (refPageIndex.current + 1)*LINKS_PER_PAGE )

    // console.log('refPageIndex.current')
    // console.log(refPageIndex.current)
    if (newData.length -1 < refPageIndex.current*LINKS_PER_PAGE) {
      // console.log('newData.slice prev')
      newData = newData.slice( refPrevPageIndex.current*LINKS_PER_PAGE, (refPrevPageIndex.current + 1)*LINKS_PER_PAGE )
    }else{
      // console.log('newData.slice cur')
      // console.log(newData.length)
      // console.log(refPageIndex.current*LINKS_PER_PAGE)
      newData = newData.slice( refPageIndex.current*LINKS_PER_PAGE, (refPageIndex.current + 1)*LINKS_PER_PAGE )
    }

    // console.log('newData.slice')
    // console.log(propsLoading.data)
    // console.log(newData)
  }
  const iTotal = refPageIndex.current*LINKS_PER_PAGE

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
//export default LinkList

//experience: pagination
//)load first page with first=2, after=null
//)press NextPage, load next(second) page with first=2 after=pageInfo.endCursor
//  after pageInfo.hasPreviousPage=false?!

// hasPreviousPage make sense only after one goPrevPage( last=2, before=dfdfdfd)
