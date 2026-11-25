const USER_AUTH_KEYS = ['userToken', 'userName', 'userEmail', 'isLoggedIn']

export const clearUserSession = () => {
  USER_AUTH_KEYS.forEach(key => localStorage.removeItem(key))

  window.dispatchEvent(new Event('userSessionExpired'))
}

const getTokenExpiry = token => {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(atob(base64))

    return Number(decoded.exp) * 1000
  } catch {
    return null
  }
}

export const checkUserSession = () => {
  const token = localStorage.getItem('userToken')

  if (!token) return false

  const expiryTime = getTokenExpiry(token)

  if (!expiryTime || expiryTime <= Date.now()) {
    clearUserSession()
    return false
  }

  return true
}

export const startUserSessionTimer = () => {
  let timer

  const scheduleExpiry = () => {
    clearTimeout(timer)

    if (!checkUserSession()) return

    const token = localStorage.getItem('userToken')
    const expiryTime = getTokenExpiry(token)

    if (!expiryTime) return

    timer = setTimeout(() => {
      checkUserSession()
    }, Math.max(0, expiryTime - Date.now()))
  }

  scheduleExpiry()

  window.addEventListener('userSessionUpdated', scheduleExpiry)

  return () => {
    clearTimeout(timer)
    window.removeEventListener('userSessionUpdated', scheduleExpiry)
  }
}
