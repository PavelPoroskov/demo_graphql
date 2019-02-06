import gql from 'graphql-tag'

import netclient from '../App/netclient'

const MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
      }
      token
    }
  }
`

function commit( email, password ) {
  return netclient.client.mutate({
    mutation: MUTATION,
    variables: {
      email,
      password
    }
  })
  .then( result => {
    const { data, ...rest } = result
    return {
      data: {
        token: data.login.token,
        id: data.login.user.id
      },
      ...rest
    }
  })
}

export default {
  commit
}