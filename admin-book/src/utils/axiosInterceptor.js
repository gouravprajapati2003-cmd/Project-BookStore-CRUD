import axios from 'axios'

// Admin Panel Global Axios Response Interceptor
axios.interceptors.response.use(
  response => response,

  error => {
    if (error.response?.status === 401) {
      const adminToken = localStorage.getItem('adminToken')

      if (adminToken) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminName')
        localStorage.removeItem('adminEmail')
        localStorage.removeItem('adminUserType')
        localStorage.removeItem('adminIsSuperAdmin')
        localStorage.removeItem('adminLoginTime')

        window.location.replace('/admin/')
      }
    }

    return Promise.reject(error)
  }
)
