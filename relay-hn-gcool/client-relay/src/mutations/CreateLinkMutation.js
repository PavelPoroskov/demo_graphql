// 1
import { commitMutation } from 'react-relay'
import graphql from "babel-plugin-relay/macro";
import environment from '../Environment'

// 2
//        createdAt
const mutation = graphql`
  mutation CreateLinkMutation($input: CreateLinkInput!) {
    createLink(input: $input) {
      link {
        id
        url
        description
      }
    }
  }
`

// 3
//const commit = (environment, description, url, callback) => {
const commit = ( description, url, callback) => {
  // 4
  const variables = {
    input: {
      description,
      url,
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
        callback()
      },
      onError: err => console.error(err),
    },
  )
}

export default {
  commit
}