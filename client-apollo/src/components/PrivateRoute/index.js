import React, { useContext } from 'react'

import PrivateRouteView from './View'

import {AppContext} from '../../App/context';

//import { GC_USER_ID, GC_AUTH_TOKEN } from '../../constants'
export default
function PrivateRout(props) {

  const context = useContext(AppContext)

  return <PrivateRouteView loggedUserId={context.loggedUserId} {...props} />
}
