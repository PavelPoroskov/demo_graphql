import React, { useState, useMemo } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'

import Header from '../Header'
import LinkListPage from '../LinkListPage'
import CreateLink from '../CreateLink'
import Login from '../Login'

import {AppContext} from '../../context';
import { getCurrentUserIdToken, setCurrentUserIdToken } from '../../Environment'

const {userId} = getCurrentUserIdToken()

export default
function App() {

  const [loggedUserId, setLoggedUserId] = useState(userId)
  const memoizedContextValue = useMemo(() => ({
    loggedUserId,
    login: (userId, userToken) => {
      setLoggedUserId(userId)
      setCurrentUserIdToken(userId, userToken)
    },
    logout: () => {
      setLoggedUserId('')
      setCurrentUserIdToken('', '')
    }
  }), [loggedUserId]);


  return (
    <AppContext.Provider value={memoizedContextValue}>
      <BrowserRouter> 
        <div className='center w85'>
          <Header />
          <div className='ph3 pv1 background-gray'>
            <Switch>
              <Route exact path='/' component={LinkListPage}/>
              <Route exact path='/login' component={Login}/>
              <PrivateRoute exact path='/create' component={CreateLink}/>
              <Redirect to='/'/>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  )
}
