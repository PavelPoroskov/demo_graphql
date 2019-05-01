import React, { useCallback } from 'react'
import { withRouter } from 'react-router'

import HeaderView from './View'

import {useAuthContext} from '../../App/context';

//import { GC_USER_ID, GC_AUTH_TOKEN } from '../../constants'

function Header(props) {

  const context = useAuthContext()
  const onLogout = useCallback( () => {
    context.logout()
    props.history.push(`/`)
  }, [context, props.history] )

  return <HeaderView userId={context.loggedUserId} logout={onLogout} />
}

export default withRouter(Header)