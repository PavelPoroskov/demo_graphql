import React, { useContext } from 'react'
//import React from 'react'

import {AppContext} from '../../App/context';
import LoginView from './View'

import AuthenticateUserMutation from '../../mutations/AuthenticateUser'
import SignupUserMutation from '../../mutations/SignupUser'


export default 
function Login(props) {

  const context = useContext(AppContext)

  const cbLogin = (login, email, password, name, ui_callbackError) => {

    let result = {}
    if (login) {
      result = AuthenticateUserMutation.commit(email, password)
    } else {
      result = SignupUserMutation.commit(email, password, name)
    }

    console.log('cbLogin')
    console.log(result)

    if (result.errors) {
      ui_callbackError(result.errors)
      return
    }

    context.login( result.data.id, result.data.token )
    props.history.push(`/`)
  }

  return <LoginView submit={cbLogin} />
}
