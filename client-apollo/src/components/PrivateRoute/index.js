import React from 'react'

import PrivateRouteView from './View'

import {useAuthContext} from '../../App/context';

//import { GC_USER_ID, GC_AUTH_TOKEN } from '../../constants'
export default
function PrivateRout(props) {

  const context = useAuthContext()

  return <PrivateRouteView loggedUserId={context.loggedUserId} {...props} />
}
