import React, { useCallback } from 'react'
import gql from 'graphql-tag'

import netclient from '../App/netclient'

import CreateLinkView from './View'


const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

export default 
function CreateLin(props) {

  const createLink = useCallback( (url, description) => {
    netclient.client.mutate({
      mutation: POST_MUTATION,
      variables: {
        url,
        description
      }
    })
    .then( () => {
      props.history.push('/')
    })
    .catch( (error) => {
      //onError(error)
    })
  }      
  , [true] )

  return <CreateLinkView createLink={createLink} />
}
