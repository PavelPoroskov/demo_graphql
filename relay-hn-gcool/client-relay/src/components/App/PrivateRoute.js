import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = (props) => {
  
  const { component: Component, ...rest } = props

  if (checkedUser) {
    return <Route {...rest} component={Component}/>
  }

  return (
    <Route {...rest} render={props => <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
      }
    />
  )
}

