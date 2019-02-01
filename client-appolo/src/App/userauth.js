const GC_USER_ID = 'graphcool-user-id22'
const GC_AUTH_TOKEN = 'graphcool-auth-token22'

let userId = localStorage.getItem(GC_USER_ID) || ''
//let userToken = localStorage.getItem(GC_AUTH_TOKEN) || ''
let userToken = localStorage.getItem(GC_AUTH_TOKEN) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanJnejQ2ZjQwMGdiMDc0NHg4bzAyMjduIiwiaWF0IjoxNTQ4NzE5NTg1fQ.avim5_0OcETgsgVhzAODzSJi6x_UY2ylWdbDY6nKDSM'

const setCurrentUserIdToken = (_userId, _userToken) => {
  userId = _userId
  userToken = _userToken

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
