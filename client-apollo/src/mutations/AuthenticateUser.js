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

const wrapErrorAsync = async ( ...rest) => {
  let result = {}

  try {
    result = await commit.apply( null, rest )
  } catch (e) {
    result['errors'] = e
  }

  return result
}

export default {
  commit: wrapErrorAsync
}