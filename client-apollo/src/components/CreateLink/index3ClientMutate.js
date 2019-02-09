import React, { useContext } from 'react'
import gql from 'graphql-tag'

//import netclient from '../App/netclient'
import {AppContext} from '../../App/context'

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

  const context = useContext(AppContext)

  const createLink = async (url, description) => {
    try {
      await context.client.mutate({
        mutation: POST_MUTATION,
        variables: {
          url,
          description
        }
      })
      props.history.push('/')
    } catch(e) {
      //...
    }
  }  

  return <CreateLinkView createLink={createLink} />
}
