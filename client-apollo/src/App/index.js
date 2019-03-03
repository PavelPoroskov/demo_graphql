import React, { useState, useMemo } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'

import {AppContext} from './context'
import netclient from './netclient'

import PrivateRoute from '../components/PrivateRoute'
import ErrorBoundary from '../components/ErrorBoundary'

import Header from '../components/Header'
import LinkList from '../components/LinkList'
import Search from '../components/Search'
import Login from '../components/Login'
import CreateLink from '../components/CreateLink'

import './App.css';


const {userId} = netclient.getCurrentUserIdToken()

// export default
// React.memo()

export default
function App() {

  const [loggedUserId, setLoggedUserId] = useState(userId)
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

//          <ErrorBoundary othererrors={errors}>

  return (
    <AppContext.Provider value={memoizedContextValue}>
      <ApolloProvider client={netclient.client}>
        <BrowserRouter> 
          <div className='center w85'>
            <Header />
            <div className='ph3 pv1 background-gray'>
            <ErrorBoundary>
              <Switch>
                <Route exact path='/page/:page' component={LinkList}/>
                {/*
                <Route exact path='/top' component={LinkList}/>
                */}
                <Route exact path='/search' component={Search}/>
                <Route exact path='/login' component={Login}/>
                <PrivateRoute exact path='/create' component={CreateLink}/>
                <Redirect to='/page/1'/>
              </Switch>
            </ErrorBoundary>
            </div>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    </AppContext.Provider>
  )
}
