import React, { useCallback } from 'react'
import CreateLinkView from './View'

import CreateLinkMutation from '../../mutations/CreateLinkMutation'

export default 
function CreateLin(props) {

  const createLink = useCallback( (url, description) => {
    CreateLinkMutation.commit( 
      //this.props.relay.environment, 
      //postedById,
      url, 
      description, 
      () => {
        console.log(`Mutation completed`)

        props.history.push('/')
      }
    )
  }      
  , [true] )

  return <CreateLinkView createLink={createLink} />
}
