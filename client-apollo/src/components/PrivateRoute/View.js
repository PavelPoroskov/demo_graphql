import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export default
function PrivateRouteSub(props) {
  
  const { component: Component, loggedUserId, ...rest } = props

  return (
    loggedUserId ? (<Route {...rest} component={Component}/>)
    : (<Route {...rest} render={props => <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
      } />)
  )
}
