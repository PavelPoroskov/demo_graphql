import React, {useState, useEffect, useRef} from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'

import LinkListView from './View'

const LINKS_PER_PAGE = 1

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $after: String, $orderBy: LinkOrderByInput) {
    feed(first: $first, after: $after, orderBy: $orderBy) {
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
const useEffectApolloQuery = ( client, _FEED_QUERY, variables={}, path=(data) => data, _arSubscriptions=[] ) => {

  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(undefined)

  const obsvSubsriptions = useRef( [] );

  async function asyncFunction() {
    try {
      //console.log('watchQuery subscribe')
      setLoading(true)
      const observableMain = client.watchQuery({
        query: FEED_QUERY,
        variables
      })

      const subscriptionMain = observableMain.subscribe(
        resultNext => {
          //console.log(`watchQuery: next()`)
          //console.log(resultNext)

          let newData = path(resultNext.data)
          if (Array.isArray(newData)) {
            //newData = [ ...newData ]
            newData = newData.slice( )
          }else if ((!!newData) && (newData.constructor === Object)) {
            //newData = { ...newData0 }
            newData = Object.assign( {}, newData )
          }

          setData( newData ) 
          setError(undefined)
          setLoading(false)

          if (Array.isArray(_arSubscriptions) && obsvSubsriptions.current.length === 1) {
            for (let subscribtion of _arSubscriptions) {
//              console.log('Subscription level 2: begin')
              const obserableSub = client.subscribe({
                query: subscribtion.query
                //variables
              })
              const subscriptionSlave = obserableSub.subscribe(
                resultNextSub => {
                  // console.log('Subscription level 2: next')
                  // console.log(resultNextSub)
                  if (subscribtion.fnToChache) {
                    subscribtion.fnToChache(resultNextSub)
                  }
                }
              )
              obsvSubsriptions.current.push(subscriptionSlave)
            }
          } 
          //setTimestamp(Date.now())
        },
        err => {
          setError(err)
          setLoading(false)
        },
        () => {
          //console.log('watchQuery finished')
        }
      )
      obsvSubsriptions.current.push(subscriptionMain)

    }catch (e) {

      setLoading(false)
      setError(e)
    }
  }

  useEffect( () => {
    asyncFunction()
    return () => {
      //console.log('watchQuery unsubscribe')
      for (let obsvSubscription of obsvSubsriptions.current) {
        //console.log('UNsubscribe')
        obsvSubscription.unsubscribe()
      }
    }
  }, Object.keys(variables).map( key => variables[key] ) )

  return {
    loading,
    error,
    data,
    //timestamp
  }
}

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
  
  const [after, setAfter] = useState(null)

  const nPage = parseInt(props.match.params.page, 10)
  const queryVariables = {
    //skip: (iPage - 1) * LINKS_PER_PAGE,
    after: after,
    first: LINKS_PER_PAGE,
    orderBy: 'createdAt_DESC'
  }

  //{ loading, error, data } = 
  const propsLoading = useEffectApolloQuery( props.client, FEED_QUERY, 
    queryVariables, 
    (data) => data.feed.links, 
    [ 
      {
        query: NEW_VOTES_SUBSCRIPTION
        //fnToChache
        //dont need fnToChache(). Perhaps result = {data: {newVote: {link: {id, votes}}}}
        // link: {id, votes} go to cache auto?
      },
      {
        query: NEW_LINKS_SUBSCRIPTION,
        //need fnToChache(), result = {data:{ newLink: {id,...} }
        fnToChache: result => {
          // console.log('fnToChache')
          // console.log(props)
          const data = props.client.readQuery({ query: FEED_QUERY, variables: queryVariables })

          data.feed.links.push(result.data.newLink)

          props.client.writeQuery({ query: FEED_QUERY, data, variables: queryVariables })
        }
      },
    ] 
  )


  const _previousPage = () => {
    if (1 < nPage) {
      const previousPage = nPage - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }
  const _nextPage = () => {
    // if (iPage <= data.feed.count / LINKS_PER_PAGE) {
    //   const nextPage = iPage + 1
    //   this.props.history.push(`/new/${nextPage}`)
    // }
    let ar = propsLoading.data
    if (ar && Array.isArray(ar) && 0 < ar.length) {
      setAfter(ar[ar.length-1].id)
    }
  }

  return (
    <React.Fragment >
      <EnhancedLinkListView {...propsLoading} nPage={nPage}/>
      <div className="flex ml4 mv3 gray">
        <div className="pointer mr2" onClick={_previousPage}>
          Previous
        </div>
        <div className="pointer" onClick={() => _nextPage()}>
          Next
        </div>
      </div>
    </React.Fragment>
  )
}

export default withApollo(LinkList)
