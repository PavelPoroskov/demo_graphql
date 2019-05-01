import React, { useContext, useCallback } from 'react'
//import React from 'react'

import {AppContext} from '../../context';
import LoginView from './View'

import AuthenticateUserMutation from '../../mutations/AuthenticateUserMutation'
import SignupUserMutation from '../../mutations/SignupUserMutation'


//import { GC_USER_ID, GC_AUTH_TOKEN } from '../../constants'
export default 
function Login(props) {

  const context = useContext(AppContext)
  const cbLogin = useCallback( (login, email, password, name, ui_callbackError) => {
    if (login) {
      AuthenticateUserMutation.commit(email, password, (id, token, errors) => {
        context.login(id, token)
        props.history.push(`/`)
      })
    } else {
      SignupUserMutation.commit(email, password, name, (id, token, errors) => {
        if (errors) {
          //this.setState({ errors: errors })
          ui_callbackError(errors)
          return
        }
        context.login(id, token)
        props.history.push(`/`)
      })
    }      
  }, [context, props.history] )

  return <LoginView submit={cbLogin} />
}
