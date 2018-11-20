import { commitMutation } from 'react-relay'
import graphql from "babel-plugin-relay/macro"

import environment from '../Environment'


  // mutation CreateUserMutation($createUserInput: SignupUserInput!, $signinUserInput: SigninUserInput!) {
  //   signupUser(input: $createUserInput) {
const mutation = graphql`
  mutation SignupUserMutation($email: String!, $password: String!, $name: String) {
    signupUser(email: $email, password: $password, name: $name) {
      id
      token
    }
  }
`

const commit = ( email, password, name, callback) => {
  const variables = {
    name,
    email,
    password,
    clientMutationId: ""
  }

  // 3
  commitMutation(
    environment,
    {
      mutation,
      variables,
      // 4
      onCompleted: (response, errors) => {
        if (errors) {
          const ar = errors.map( o => o.message )
          callback(null, null, ar)
          return
        }
        const id = response.signupUser.id
        const token = response.signupUser.token

        //console.log('did signup ' + email)
        callback(id, token)
      },
      onError: err => console.error(err),
    },
  )
}

export default {
  commit
}