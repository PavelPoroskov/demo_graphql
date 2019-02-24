import {useState, useEffect, useRef} from 'react'

//const useEffectApolloQuery = ( client, _FEED_QUERY, variables={}, fnGetData=(data) => data, _arSubscriptions=[] ) => {
const useEffectApolloQuery = ( client, _FEED_QUERY, variables={}, fnGetData, _arSubscriptions=[] ) => {

  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(undefined)

  const obsvSubsriptions = useRef( [] );

  async function asyncFunction() {
    try {
      //console.log('watchQuery subscribe')
      setLoading(true)
      const observableMain = client.watchQuery({
        query: _FEED_QUERY,
        variables
      })

      const subscriptionMain = observableMain.subscribe(
        resultNext => {
          //console.log(`watchQuery: next()`)
          //console.log(resultNext)

          let newData = resultNext
          if (fnGetData) {
            newData = fnGetData(resultNext)
            if (Array.isArray(newData)) {
              //newData = [ ...newData ]
              newData = newData.slice( )
            }else if ((!!newData) && (newData.constructor === Object)) {
              //newData = { ...newData0 }
              newData = Object.assign( {}, newData )
            }
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
                  if (subscribtion.fnToCache) {
                    subscribtion.fnToCache(resultNextSub)
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

export {
  useEffectApolloQuery
}