// 1
import { commitMutation } from 'react-relay'
import graphql from "babel-plugin-relay/macro"

import {environment, getCurrentUserIdToken} from '../Environment'

// 2
//        createdAt
const mutation = graphql`
  mutation CreateLinkMutation($input: CreateLinkInput!) {
    createLink(input: $input) {
      link {
        id
        url
        description
        postedBy {
          id
          name
        }
      }
    }
  }
`

// 3
//const commit = (environment, description, url, callback) => {
const commit = ( url, description, callbackCompleted, callbackError ) => {

  const {userId} = getCurrentUserIdToken()
  // 4
  const variables = {
    input: {
      postedById: userId,
      url,
      description,
      clientMutationId: ""
    },
  }

  // 5
  commitMutation(
    environment,
    {
      mutation,
      variables,
      // 6
      onCompleted: () => {
        callbackCompleted()
      },
      onError: err => {
        console.error(err)
        //callbackError(err)
      },
    },
  )
}

export default {
  commit
}