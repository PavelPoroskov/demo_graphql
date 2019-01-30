import { commitMutation } from 'react-relay'
import graphql from "babel-plugin-relay/macro"

import {environment} from '../Environment'


  // mutation CreateUserMutation($createUserInput: SignupUserInput!, $signinUserInput: SigninUserInput!) {
  //   signupUser(input: $createUserInput) {
const mutation = graphql`
  mutation AuthenticateUserMutation($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      id
      token
    }
  }
`

const commit = (email, password, callback) => {
  const variables = {
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
      onCompleted: (response) => {
        const id = response.authenticateUser.id
        const token = response.authenticateUser.token

        console.log('did authenticateUser ' + email)
        callback(id, token)
      },
      onError: err => console.error(err),
    },
  )
}

export default {
  commit
}