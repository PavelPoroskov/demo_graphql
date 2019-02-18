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

const useEffectApolloQuery = ( client, _FEED_QUERY, variables={}, path=(data) => data ) => {

  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(undefined)
  //const [timestamp, setTimestamp] = useState(undefined)

  const savedSubscription = useRef();

  async function asyncFunction() {
    try {
      //console.log(`useCustomEffectQueryGraphQl: start`)
      setLoading(true)
      const observable = client.watchQuery({
        query: FEED_QUERY,
        variables
      })

      //console.log('watchQuery subscribe')
      savedSubscription.current = observable.subscribe(
        resultNext => {
          // console.log(`watchQuery: next()`)
          // console.log(resultNext)

          //const resultNext = observable.getCurrentResult()
          //if (loading) {
            // setLoading(false)
          //}
          //setData(result)
          
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

      // const result = await observable.result()

      // console.log(`watchQuery: result()`)
      // console.log(result)

      // setLoading(false)
      // //setData(result)
      // setData( path(result.data) ) 
    }catch (e) {
      //console.log(`useCustomEffectQueryGraphQl: end Error`)
      setLoading(false)
      setError(e)
    }
  }

  useEffect( () => {
    asyncFunction()
    return () => {
      //console.log('watchQuery unsubscribe')
      savedSubscription.current.unsubscribe()
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

const LinkList = (props) => {
  
  const propsLoading = useEffectApolloQuery( props.client, FEED_QUERY, {}, (data) => data.feed.links )

  // console.log(`LinkList`)
  // console.log(propsLoading.data)
  return <EnhancedLinkListView {...propsLoading} />
//  return (
//    <React.Fragment>
//      () => <EnhancedLinkListView {...propsLoading} />
//    <React.Fragment/>
//   )
}

export default withApollo(LinkList)