import React//, { useCallback } 
from 'react'
import { withApollo } from 'react-apollo'

import CreateLinkView from './View'
import CreateLinkMutation from '../../mutations/CreateLink'

// const createLink = async (url, description) => {
//   try {
//     await CreateLinkMutation.commit( url, description )
//     props.history.push('/')
//   } catch(e) {
//     //...
//   }
// }      

function CreateLin(props) {

  // const createLink = useCallback( async (url, description) => {
  //   try {
  //     await CreateLinkMutation.commit( url, description )
  //     props.history.push('/')
  //   } catch(e) {
  //     //...
  //   }
  // }      
  // , [true] )
  const createLink = async (url, description) => {
    let result = await CreateLinkMutation.commit( props.client, url, description )
    if (result.errors) {
      return
    }
    //console.log('create link props.history.push() before')
    props.history.push('/')
    //console.log('create link props.history.push() after')
  }

  return <CreateLinkView createLink={createLink} />
}

export default withApollo(CreateLin)