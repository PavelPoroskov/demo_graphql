const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')


async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10)
  // 2
  const user = await context.prisma.createUser({ ...args, password })

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // //use_coockie
  // context.req.session.user = {
  //   id: user.id
  // };

  // 4
  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)
  
  // //use_coockie
  // context.req.session.user = {
  //   id: user.id
  // }

  // 3
  return {
    token,
    user,
  }
}

// //test scenario
// login as user1
// logout
// login as user2

// login as user1
// login as user2

// login as user1
// close app-tab
// reopen app-tab (want isLoging) 


// //use_coockie
// async function logout(parent, args, context, info) {

//   if (context.req.session.user) {
//     delete context.req.session
//     //context.req.session = null
//   }

//   return true
// }

function post(parent, args, context, info) {
  const userId = getUserId(context)
  if (!args.url) {
    throw new Error('Need not empty URL')
  }
  // if (!args.description) {
  //   throw new Error('Need not empty description')
  // }
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  })
}

async function vote(parent, args, context, info) {
  // 1
  const userId = getUserId(context)

  // 2
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  })
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  // 3
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  })
}

const updateLink = (root, args, context) => {
  return context.prisma.updateLink({
    data: {
      url: args.url,
      description: args.description,
    }, 
    where: {
      id: args.id
    }
  } )
}
const deleteLink = (root, args, context) => {
  return context.prisma.deleteLink({
    id: args.id
  })
}

module.exports = {
  signup,
  login,
  //logout,
  post,
  vote,

  updateLink,
  deleteLink,
}