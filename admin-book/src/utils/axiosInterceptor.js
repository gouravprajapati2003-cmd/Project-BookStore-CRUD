import axios from 'axios'

// Global Axios Response Interceptor
axios.interceptors.response.use(
  response => response,

  error => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token')

      if (token) {
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        localStorage.removeItem('email')
        localStorage.removeItem('userType')
        localStorage.removeItem('isSuperAdmin')
        localStorage.removeItem('adminLoginTime')

        window.location.replace('/')
      }
    }

    return Promise.reject(error)
  }
)
