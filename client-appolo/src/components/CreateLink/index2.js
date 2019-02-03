import React, { useCallback } from 'react'

import CreateLinkView from './View'
import CreateLinkMutation from '../../mutations/CreateLink'


export default 
function CreateLin(props) {

  const createLink = useCallback( (url, description) => {
    CreateLinkMutation.commit( 
      url, 
      description,
      () => {
        props.history.push('/')
      }
    )
  }      
  , [true] )

  return <CreateLinkView createLink={createLink} />

//  return <CreateLinkView createLink={CreateLinkMutation.commit} />
}
