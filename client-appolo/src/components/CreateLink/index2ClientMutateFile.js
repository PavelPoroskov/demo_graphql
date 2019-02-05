import React//, { useCallback } 
from 'react'

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

export default 
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
    try {
      await CreateLinkMutation.commit( url, description )
      props.history.push('/')
    } catch(e) {
      //...
    }
  }

  return <CreateLinkView createLink={createLink} />
}
