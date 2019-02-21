const { GraphQLServer } = require('graphql-yoga')
// //use_coockie
// const session = require('express-session');
// const ms = require('ms')

const { prisma } = require('./generated/prisma-client')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
}

const server = new GraphQLServer({
  typeDefs: './src/app-schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
      //use_coockie
      //req: request.request,
    }
  },
})

// //use_coockie
// server.express.use(session({
//   name: 'qid',
//   secret: `some-random-secret-here`,
//   resave: true,
// //  saveUninitialized: true,
//   saveUninitialized: false,
//   //'trust proxy': 1,
//   unset: 'destroy',
//   cookie: {
//     httpOnly: false, //only debug
//     //httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     maxAge: ms('1d'), // insted of 'expires',
//     //sameSite: 'strict',
//   },
// }))

let opts = {}
// //use_coockie
// opt = Object.assign( opt, {
//   port: 4000,
//   cors: {
//     credentials: true,
//     origin: ['http://localhost:3000'] // your frontend url.
//   },
//   // https: {
//     // cert: string | Buffer,
//     // key: string | Buffer
//   // }
// })

server.start( opts, () => console.log(`Server is running on http://localhost:4000`) )

//http://localhost:3000/
//http://localhost:3000/