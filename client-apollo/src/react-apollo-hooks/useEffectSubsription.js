import {useState, useEffect, useRef} from 'react'


const useEffectSubscription = ( client, query, variables={}, fnGetData ) => {

  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(undefined)

  async function asyncFunction() {

  }

  useEffect( () => {

    //console.log('react-apollo-hooks.js / useEffectApolloConnection')

    asyncFunction()

  }, [] )

  return {
    loading,
    error,
    data,
  }
}

export default useEffectSubscription