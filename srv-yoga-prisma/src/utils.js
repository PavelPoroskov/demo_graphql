const jwt = require('jsonwebtoken')
const APP_SECRET = 'brrrr rrr'

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  // //use_coockie
  // if (context.req.session.user) {
  //   userId = context.req.session.user.id

  //   return userId
  // }

  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getUserId,
}