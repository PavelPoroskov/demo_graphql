import gql from 'graphql-tag'

import netclient from '../App/netclient'

const MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      user {
        id
      }
      token
    }
  }
`

function commit( email, password, name ) {
  return netclient.client.mutate({
    mutation: MUTATION,
    variables: {
      email,
      password,
      name,
    }
  })
  .then( result => {
    const { data, ...rest } = result
    return {
      data: {
        token: data.signup.token,
        id: data.signup.user.id
      },
      ...rest
    }
  })
}

export default {
  commit
}