const { GraphQLServer } = require('graphql-yoga')
const session = require('express-session');
const ms = require('ms')

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
      //...request,
      //request,
      req: request.request,
      prisma,
    }
  },
})

server.express.use(session({
  name: 'qid',
  secret: `some-random-secret-here`,
  resave: true,
  saveUninitialized: true,
  //'trust proxy': 1,
  cookie: {
    httpOnly: false,
    //httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: ms('1d'), // insted of 'expires',
    //sameSite: 'strict',
  },
}))

const opts = {
  port: 4000,
  cors: {
    credentials: true,
    origin: ['http://localhost:3000'] // your frontend url.
  },
  // https: {
    // cert: string | Buffer,
    // key: string | Buffer
  // }
};

server.start( opts, () => console.log(`Server is running on http://localhost:4000`) )

//http://localhost:3000/
//http://localhost:3000/