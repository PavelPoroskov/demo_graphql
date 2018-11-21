import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Header from '../Header'
import LinkListPage from '../LinkListPage'
import CreateLink from '../CreateLink'
import Login from '../Login'


export default
class App extends Component {
  render() {
    //console.log('App render')

    return (
      <BrowserRouter> 
        <div className='center w85'>
          <Header />
          <div className='ph3 pv1 background-gray'>
            <Switch>
              <Route exact path='/' component={LinkListPage}/>
              <Route exact path='/create' component={CreateLink}/>
              <Route exact path='/login' component={Login}/>
             </Switch>
          </div>
        </div>
      </BrowserRouter>
    )
  }
}
