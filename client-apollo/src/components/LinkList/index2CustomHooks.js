import React, {useState, useEffect, useRef} from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'

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
  
  const propsLoading = useEffectApolloQuery( props.client, FEED_QUERY, {}, (data) => data.feed.links, [ 
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
        const data = props.client.readQuery({ query: FEED_QUERY })

        data.feed.links.push(result.data.newLink)

        props.client.writeQuery({ query: FEED_QUERY, data })
      }
    },
  ] )

  return <EnhancedLinkListView {...propsLoading} />
}

export default withApollo(LinkList)
