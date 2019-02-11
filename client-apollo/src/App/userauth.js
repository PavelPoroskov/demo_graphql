// const GC_USER_ID = 'graphcool-user-id22'
// const GC_AUTH_TOKEN = 'graphcool-auth-token22'

// let userId = localStorage.getItem(GC_USER_ID) || ''
// let userToken = localStorage.getItem(GC_AUTH_TOKEN) || ''
let userId = ''
let userToken = ''

const setCurrentUserIdToken = (_userId, _userToken) => {
  userId = _userId
  userToken = _userToken

  // localStorage.setItem(GC_USER_ID, userId)
  // localStorage.setItem(GC_AUTH_TOKEN, userToken)  
}

const getCurrentUserIdToken = () => ({
  userId,
  userToken,
})

export {
  getCurrentUserIdToken,
  setCurrentUserIdToken
}
