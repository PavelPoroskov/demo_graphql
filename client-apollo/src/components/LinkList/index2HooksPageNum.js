import React from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'

import { useEffectQuery } from '../../react-apollo-hooks'

import LinkListView from './View'

import { LINKS_PER_PAGE } from '../../utils'

//    feed(first: $first, skip: $skip, after: $after, orderBy: $orderBy) @connection(key: "LinkList_allLinks") {
// if add @connection(key: "LinkList_allLinks"), then next page show data from first page
export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $after: String, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, after: $after, orderBy: $orderBy) {
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
      count
    }
  }
`

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
`

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

const LinkList = (props) => {
  
  const nPage = parseInt(props.match.params.page, 10)
  const iTotal = (nPage - 1)*LINKS_PER_PAGE
  let queryVariables = {
    orderBy: 'createdAt_DESC',
    first: LINKS_PER_PAGE,
    skip: (nPage - 1) * LINKS_PER_PAGE,
  }

  //{ loading, error, data } = 
  const propsLoading = useEffectQuery( props.client, FEED_QUERY, 
    queryVariables, 
//    (result) => result.data.feed.links, 
    (result) => result.data.feed, 
    [ 
      {
        query: NEW_VOTES_SUBSCRIPTION
        //fnToCache
        //dont need fnToCache(). Perhaps result = {data: {newVote: {link: {id, votes}}}}
        // link: {id, votes} go to cache auto?
      },
      {
        query: NEW_LINKS_SUBSCRIPTION,
        refetchMain: true,
        //need fnToCache(), result = {data:{ newLink: {id,...} }
        fnToCache: result => {
          //--
          //on curren page (not only last page), page size=2 with two links add third page
          console.log('fnToChache NEW_LINKS_SUBSCRIPTION')
          //console.log(queryVariables)
          let variables = { ...queryVariables, skip: 0 } 
          const data = props.client.readQuery({ query: FEED_QUERY, variables })

          //console.log(data)
          data.feed.links.unshift(result.data.newLink)

          props.client.writeQuery({ query: FEED_QUERY, data, variables })
          console.log('after')
        }

        //after: refetch page
      },
    ] 
  )

  const _nextPage = () => {
    if (propsLoading.data) {
      if (nPage*LINKS_PER_PAGE < propsLoading.data.count) {
        const nextPage = nPage + 1
        props.history.push(`/page/${nextPage}`)
      }
    }
  }
  const _previousPage = () => {
    if (1 < nPage) {
      const previousPage = nPage - 1
      props.history.push(`/page/${previousPage}`)
    }
  }

  let newData = null
  if (propsLoading.data) {
    newData = propsLoading.data.links.slice()
  }

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
