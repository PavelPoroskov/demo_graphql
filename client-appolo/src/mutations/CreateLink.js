import gql from 'graphql-tag'

import netclient from '../App/netclient'

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

function commit( url, description, onComplete, onError ) {
  netclient.client.mutate({
    mutation: POST_MUTATION,
    variables: {
      url,
      description
    }
  })
  .then( () => {
    onComplete()
  })
  .catch( (error) => {
    onError(error)
  })
}

export default {
  commit
}