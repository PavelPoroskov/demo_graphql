import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import * as bcrypt from 'bcryptjs'
import * as validator from 'validator'

interface User {
  id: string
}

interface EventData {
  email: string
  password: string
  name: string
}

const SALT_ROUNDS = 10

export default async (event: FunctionEvent<EventData>) => {
  //console.log("******* 0")
  console.log(event)

  try {
    //console.log("******* 1")
    const graphcool = fromEvent(event)
    //console.log("******* 2")
    const api = graphcool.api('simple/v1')

    //console.log("******* 3")
    const { email, password, name } = event.data


    if (!validator.isEmail(email)) {
      return { error: 'Not a valid email' }
    }

    // check if user exists already
    const userExists: boolean = await getUser(api, email)
      .then(r => r.User !== null)
    if (userExists) {
      return { error: 'Email already in use' }
    }

    // create password hash
    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    const hash = await bcrypt.hash(password, salt)

    // create new user
    //console.log("******* 4")
    const userId = await createGraphcoolUser(api, email, name, hash)
    //console.log("******* 5")

    // generate node token for new User node
    const token = await graphcool.generateNodeToken(userId, 'User')

    return { data: { id: userId, token } }
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occured during signup.' }
  }
}

async function getUser(api: GraphQLClient, email: string): Promise<{ User }> {
  const query = `
    query getUser($email: String!) {
      User(email: $email) {
        id
      }
    }
  `

  const variables = {
    email,
  }

  return api.request<{ User }>(query, variables)
}

async function createGraphcoolUser(api: GraphQLClient, email: string, name: string, password: string): Promise<string> {
  const mutation = `
    mutation createGraphcoolUser($email: String!, $password: String!, $name: String!) {
      createUser(
        email: $email,
        password: $password,
        name: $name
      ) {
        id
      }
    }
  `

  const variables = {
    email,
    password: password,
    name
  }

  return api.request<{ createUser: User }>(mutation, variables)
    .then(r => r.createUser.id)
}
