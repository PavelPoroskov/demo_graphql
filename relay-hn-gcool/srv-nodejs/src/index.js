const { GraphQLServer } = require('graphql-yoga')

const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.prisma.links()
    },
  },
  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      })
    },
  },
}

// const resolvers = {
//   Query: {
//     info: () => `This is the API of a Hackernews Clone`,
//     // 2
//     feed: () => links,

//     link: (root, args) => {
//       let ar = links.filter( o => o.id === args.id )
//       let res = ar.length ? ar[0] : null

//       return res
//     },
//   },
//   // // 3
//   // Link: {
//   //   id: (root) => root.id,
//   //   description: (root) => root.description,
//   //   url: (root) => root.url,
//   // },
//   Mutation: {
//     // 2
//     post: (root, args) => {
//        const link = {
//         id: `link-${idCount++}`,
//         description: args.description,
//         url: args.url,
//       }
//       links.push(link)
//       return link
//     },
//     updateLink: (root, args) => {
//       let ar = links.filter( o => o.id === args.id )
//       let res = ar.length ? ar[0] : null
//       if (res) {
//         res.description = args.description
//         res.url = args.url
//       }

//       return res
//     },
//     deleteLink: (root, args) => {


//       let ind = links.findIndex( o => o.id === args.id )
//       let res = null
//       if (-1 < ind) {
//         res = { ...links[ind] }
//         //delete links[ar[0]]
//         links.splice( ind, 1 )
//       }

//       return res
//     },
//   },  
// }

// 3
// const server = new GraphQLServer({
//   typeDefs: './src/schema.graphql',
//   resolvers,
// })

const server = new GraphQLServer({
  typeDefs: './src/app-schema.graphql',
  resolvers,
  context: {
    prisma
  }
})

server.start(() => console.log(`Server is running on http://localhost:4000`))