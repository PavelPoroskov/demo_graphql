import {useState, useEffect, useRef} from 'react'

//const useEffectApolloQuery = ( client, _FEED_QUERY, variables={}, fnGetData=(data) => data, _arSubscriptions=[] ) => {
const useEffectApolloQuery = ( client, _FEED_QUERY, variables={}, fnGetData, _arSubscriptions=[] ) => {

  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(undefined)

  const refObsvSubsriptions = useRef( [] );
  const refObservableMain = useRef( undefined );

  async function asyncFunction() {
    try {
      // console.log(data)
      // console.log(error)
      // console.log(loading)

      // if (refObservableMain.current) {
      //   console.log('watchQuery refresh')
      //   // // op1) .refetch, unsuscribe, subscribe
      //   // //    get two subcribe.next
      //   // //        1) old data
      //   // //        2) new data
      //   // refObservableMain.current.refetch(variables)

      //   // op2) .refetch, return here (not unsubcribe, subcribe)
      //   //   firstPage (use net), nextPage (use net), prevPage (use net), nextPage (use net)
      //   refObservableMain.current.refetch(variables)
      //   return

      //   // // op4) setVariables
      //   // //not get new data        
      //   // refObservableMain.current.setVariables(variables)
      //   // return
      // }

      if (!refObservableMain.current) {
        setLoading(true)
      }
      // op) always client.watchQuery, not refetch
      // firstPage (use net), nextPage (use net), prevPage (dont use net), nextPage (dont use net)
      console.log('watchQuery subscribe')
      refObservableMain.current = client.watchQuery({
        query: _FEED_QUERY,
        variables
      })

      const subscriptionMain = refObservableMain.current.subscribe(
        resultNext => {
          if (resultNext.networkStatus !==7) {
            return
          }
          console.log(`watchQuery: next()`)
          console.log(resultNext)

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

          if (Array.isArray(_arSubscriptions) && refObsvSubsriptions.current.length === 1) {
            for (let subscribtion of _arSubscriptions) {
              console.log('Subscription level 2: begin')
              const obserableSub = client.subscribe({
                query: subscribtion.query,
                variables
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
              refObsvSubsriptions.current.push(subscriptionSlave)
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
      refObsvSubsriptions.current.push(subscriptionMain)

    }catch (e) {

      setLoading(false)
      setError(e)
    }
  }

  useEffect( () => {

    console.log('react-apollo-hooks.js / useEffect')

    asyncFunction()

    return () => {
      console.log('watchQuery unsubscribe')
      if (refObsvSubsriptions.current && Array.isArray(refObsvSubsriptions.current) ) {
        for (let obsvSubscription of refObsvSubsriptions.current) {
          //console.log('UNsubscribe')
          obsvSubscription.unsubscribe()
        }
      }
    }
  }, Object.keys(variables).map( key => variables[key] ) )

  // //unsubscribe only on unmounting
  // useEffect( () => {
  //   return () => {
  //     console.log('watchQuery unsubscribe')
  //     if (refObsvSubsriptions.current && Array.isArray(refObsvSubsriptions.current) ) {
  //       for (let obsvSubscription of refObsvSubsriptions.current) {
  //         //console.log('UNsubscribe')
  //         obsvSubscription.unsubscribe()
  //       }
  //     }
  //   }
  // }, [] )

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