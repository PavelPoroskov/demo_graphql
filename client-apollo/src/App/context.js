import React, { useState, useMemo, useContext } from 'react'

import netclient from './netclient'

//import { getCurrentUserIdToken, setCurrentUserIdToken } from '../../Environment'

//let {userId} = getCurrentUserIdToken()

const AppContext = React.createContext({
//  loggedUserId: userId,
  loggedUserId: '',
  login: (userId, userToken) => {
  	//setCurrentUserIdToken( '', '' )
  },
  logout: () => {
  	//setCurrentUserIdToken( '', '' )
  },
  setErrors: (arErrors) => {
  	
  },
//  client: {},
  cursor: {}, // { forward: true, cursor: null }
});

function useProvideAuthContext() {

  const [loggedUserId, setLoggedUserId] = useState( () => { 
    let {userId} = netclient.getCurrentUserIdToken() 
    return userId
  })
  //const [errors, setErrors] = useState([])
  const memoizedContextValue = useMemo(() => ({
    loggedUserId,
    login: (userId, userToken) => {
      netclient.setCurrentUserIdToken(userId, userToken)
      setLoggedUserId(userId)
    },
    logout: () => {
      netclient.setCurrentUserIdToken('', '')
      setLoggedUserId('')
    },
    //client: netclient.client,
    // setErrors: (arErrors) => {
    //   setErrors(true)
    // }
  }), [loggedUserId]);

  return memoizedContextValue
}

const useAuthContext = () => {
  const contextAuth = useContext(AppContext)
  return contextAuth
}
export {
  AppContext,
  useProvideAuthContext,
  useAuthContext,
}