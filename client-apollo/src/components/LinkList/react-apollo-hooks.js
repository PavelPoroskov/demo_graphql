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
        //pageNum pagination
        //fetchPolicy: 'cache-and-network',
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
              // let breakFor = false
              const subscriptionSlave = obserableSub.subscribe(
                resultNextSub => {
                  //pageNum pagination, not need
                  // if (subscribtion.refetchMain) {
                  //   breakFor = true;
                  //   if (refObsvSubsriptions.current && Array.isArray(refObsvSubsriptions.current) ) {
                  //     for (let obsvSubscription of refObsvSubsriptions.current) {
                  //       obsvSubscription.unsubscribe()
                  //     }
                  //   }
                  //   asyncFunction()
                  // }

                  if (subscribtion.fnToCache) {
                    subscribtion.fnToCache(resultNextSub)
                  }
                }
              )
              // if (breakFor) {
              //   break
              // }
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


const useEffectApolloConnection = ( client, _FEED_QUERY, variables={}, fnGetData ) => {

  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(undefined)

  const refObservableMain = useRef( undefined )
  const refMainSubscription = useRef( undefined )

  const refCacheVariables = useRef( {} )
//  const refObsvSubsriptions = useRef( [] );
  
  function varibles2String(obj) {
    const arKeys = Object.keys(obj).sort()
    const arValues = arKeys.map( key => `${key}=${obj[key]}`)
    return arValues.join(';')
  }

  async function asyncFunction() {
    try {
      const strVaribles = varibles2String(variables)
      if (!refObservableMain.current) {
        setLoading(true)
      }
      let options = {
        query: _FEED_QUERY,
        variables
      }
      if (!(strVaribles in refCacheVariables.current)) {
        options['fetchPolicy'] = 'network-only'
      }
      console.log('watchQuery subscribe')
      console.log(options)

      let prevData = {}
      try {
        prevData = client.readQuery({ query: _FEED_QUERY })
      }catch (er){

      }

      refObservableMain.current = client.watchQuery(options)
      refCacheVariables.current[strVaribles] = true

      refMainSubscription.current = refObservableMain.current.subscribe(
        resultNext => {
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

          if (resultNext.networkStatus ===7) {
            // const data = client.readQuery({ query: _FEED_QUERY })
            // console.log('store.readQuery data')
            // console.log(data)

            // data.feed.links.unshift(result.data.post)
            // //data.feed.links.push(result.data.post)
            const currData = resultNext.data

            if (prevData.feedConnection) {

              let feedConnection = Object.assign( {}, currData.feedConnection, {
                edges: [...prevData.feedConnection.edges, ...currData.feedConnection.edges] 
              })
              client.writeQuery({ 
                query: _FEED_QUERY, 
                data: { feedConnection }
              })
            }
          }

          setData( newData ) 
          setError(undefined)
          setLoading(false)
        },
        err => {
          setError(err)
          setLoading(false)
        },
        () => {
          //console.log('watchQuery finished')
        }
      )

    }catch (e) {

      setLoading(false)
      setError(e)
    }
  }

  useEffect( () => {

    console.log('react-apollo-hooks.js / useEffectApolloConnection')

    asyncFunction()

    return () => {
      console.log('watchQuery unsubscribe')
      if (refMainSubscription.current) {
        refMainSubscription.current.unsubscribe()
      }
    }
  }, Object.keys(variables).map( key => variables[key] ) )


  // //graphql subscriptions
  // useEffect( () => {

  //   if (Array.isArray(_arSubscriptions)) {
  //     for (let subscribtion of _arSubscriptions) {
  //       console.log('Subscription level 2: begin')
  //       const obserableSub = client.subscribe({
  //         query: subscribtion.query,
  //         variables
  //       })
  //       const subscriptionSlave = obserableSub.subscribe(
  //         resultNextSub => {
  //           if (subscribtion.fnToCache) {
  //             subscribtion.fnToCache(resultNextSub)
  //           }
  //         }
  //       )
  //       refObsvSubsriptions.current.push(subscriptionSlave)
  //     }
  //   } 

  //   return () => {
  //     if (refObsvSubsriptions.current && Array.isArray(refObsvSubsriptions.current) ) {
  //       for (let obsvSubscription of refObsvSubsriptions.current) {
  //         obsvSubscription.unsubscribe()
  //       }
  //     }
  //   }
  // }, [] )

  return {
    loading,
    error,
    data,
  }
}

export {
  useEffectApolloQuery,
  useEffectApolloConnection
}