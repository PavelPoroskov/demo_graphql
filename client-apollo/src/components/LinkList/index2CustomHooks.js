import React, {useState, useEffect, useContext} from 'react'
import gql from 'graphql-tag'

import {AppContext} from '../../App/context'
//import WaitResultHoc from '../WaitResultHoc'
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

const useEffectQueryGraphQl = (_FEED_QUERY, variables={}, path=(data) => data ) => {

  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(undefined)

  const context = useContext(AppContext)

  //const arVariables = Object.keys(variables).map( key => variables[key] )

  async function asyncFunction() {
    try {
      //console.log(`useCustomEffectQueryGraphQl: start`)
      setLoading(true)
      let result = await context.client.query({
        query: FEED_QUERY,
        variables
      })
      //console.log(`useCustomEffectQueryGraphQl: end data`)
      //console.log(result)
      setLoading(false)
      //setData(result)
      setData( path(result.data) ) 
    }catch (e) {
      //console.log(`useCustomEffectQueryGraphQl: end Error`)
      setLoading(false)
      setError(e)
    }
  }

  useEffect( () => {
    asyncFunction()
  }, Object.keys(variables).map( key => variables[key] ) )
  //}, [] )

  return {
    loading,
    error,
    data,
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

export default (props) => {
  const propsLoading = useEffectQueryGraphQl( FEED_QUERY, {}, (data) => data.feed.links )

//  return <LinkListView data={data.feed.links} />
  return <EnhancedLinkListView {...propsLoading} />
}
