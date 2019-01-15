import React, { useContext } from 'react'
import { withRouter } from 'react-router'

import HeaderView from './View'

import {AppContext} from '../../context';

//import { GC_USER_ID, GC_AUTH_TOKEN } from '../../constants'

function Header(props) {

  const context = useContext(AppContext)
  const onLogout = useCallback( () => {
    context.logout()
    props.history.push(`/`)
  }, [true] )

  return <HeaderView userId={context.loggedUserId} logout={onLogout} />
}

export default withRouter(Header)