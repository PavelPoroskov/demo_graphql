const GC_USER_ID = 'graphcool-user-id'
const GC_AUTH_TOKEN = 'graphcool-auth-token'

let userId = localStorage.getItem(GC_USER_ID) || ''
let userToken = localStorage.getItem(GC_AUTH_TOKEN) || ''

const setCurrentUserIdToken = (userId, userToken) => {
  userId = userId
  userToken = userToken

  localStorage.setItem(GC_USER_ID, userId)
  localStorage.setItem(GC_AUTH_TOKEN, userToken)  
}

const getCurrentUserIdToken = () => ({
  userId,
  userToken,
})

export {
  getCurrentUserIdToken,
  setCurrentUserIdToken
}
