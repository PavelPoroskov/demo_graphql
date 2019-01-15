import { compose } from 'recompose'
//import React from 'react'

import CreateLinkView from './View'

import CreateLinkMutation from '../../mutations/CreateLinkMutation'
//import { GC_USER_ID } from '../../constants'


export default compose(
  withHandlers({
    createLink: (url, description) => {
      CreateLinkMutation.commit( 
        //this.props.relay.environment, 
        //postedById,
        url, 
        description, 
        () => {
          console.log(`Mutation completed`)

          this.props.history.push('/')
        }
      )
    }
  })
)(CreateLinkView);