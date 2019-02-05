import React from 'react'

//import { getCurrentUserIdToken, setCurrentUserIdToken } from '../../Environment'

//let {userId} = getCurrentUserIdToken()

export const AppContext = React.createContext({
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
  client: {},
});