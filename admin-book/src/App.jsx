import './utils/axiosInterceptor'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import AdminNavbar from './components/AdminNavbar'

import WelcomePage from './pages/WelcomePage/WelcomePage'
import BookList from './pages/books/BookList'
import AddBook from './pages/books/AddBook'
import BookPageForEdit from './pages/books/BookPageForEdit'
import BookDetail from './pages/books/BookDetail'

import AdminLogin from './pages/LoginSignupPages/AdminLogin'

import CreateDiscount from './pages/Discount/CreateDiscount'
import DiscountList from './pages/Discount/DiscountList'
import DiscountForEdit from './pages/Discount/DiscountForEdit'

import UserList from './pages/Users/UserList'

import PincodeList from './pages/PincodeAvailability/PincodeList'
import AddPincode from './pages/PincodeAvailability/AddPincode'
import EditPincode from './pages/PincodeAvailability/EditPincode'

import TransactionList from './pages/Transaction/TransactionList'

import CreateAdmin from './pages/Admins/CreateAdmin'
import AdminList from './pages/Admins/AdminList'

// Super Admin Protected Route
function SuperAdminRoute ({ children }) {
  const token = localStorage.getItem('token')
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true'

  if (!token) {
    return <Navigate to='/' replace />
  }

  if (!isSuperAdmin) {
    return <Navigate to='/dashboard' replace />
  }

  return children
}

// Admin Layout
function AdminLayout () {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to='/' replace />
  }

  return (
    <div className='admin-layout'>
      <AdminNavbar />

      <div className='admin-content-layout'>
        <Sidebar />

        <main className='admin-main-content'>
          <Routes>
            <Route path='/dashboard' element={<WelcomePage />} />

            {/* Book Management */}
            <Route path='/books' element={<BookList />} />
            <Route path='/add/book' element={<AddBook />} />
            <Route path='/edit/book/:id' element={<BookPageForEdit />} />
            <Route path='/book/:id' element={<BookDetail />} />

            {/* Discount Management */}
            <Route path='/discounts' element={<DiscountList />} />
            <Route path='/add/discount' element={<CreateDiscount />} />
            <Route path='/edit/discount/:id' element={<DiscountForEdit />} />

            {/* User Management */}
            <Route path='/users' element={<UserList />} />

            {/* Super Admin Only */}
            <Route
              path='/admins'
              element={
                <SuperAdminRoute>
                  <AdminList />
                </SuperAdminRoute>
              }
            />

            <Route
              path='/create/admin'
              element={
                <SuperAdminRoute>
                  <CreateAdmin />
                </SuperAdminRoute>
              }
            />

            {/* Pincode Management */}
            <Route path='/pincodes' element={<PincodeList />} />
            <Route path='/add/pincode' element={<AddPincode />} />
            <Route path='/edit/pincode/:id' element={<EditPincode />} />

            {/* Transaction Management */}
            <Route path='/transactions' element={<TransactionList />} />

            {/* Default Route */}
            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Routes>
        </main>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-layout {
          height: 100vh;
          width: 100%;
          background: #f5f7fa;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .admin-content-layout {
          display: flex;
          flex: 1;
          min-height: 0;
          width: 100%;
          overflow: hidden;
          align-items: stretch;
        }

        .admin-main-content {
          flex: 1;
          min-width: 0;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px;
          box-sizing: border-box;
          scrollbar-width: thin;
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 991px) {
          .admin-main-content {
            padding: 18px;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .admin-layout {
            height: 100vh;
            overflow: hidden;
          }

          .admin-content-layout {
            flex-direction: column;
            align-items: stretch;
            overflow: hidden;
          }

          .admin-main-content {
            width: 100%;
            max-width: 100%;
            flex: 1;
            min-height: 0;
            padding: 12px;
            overflow-y: auto;
            overflow-x: hidden;
          }
        }

        @media (max-width: 380px) {
          .admin-main-content {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  )
}

// Main App
function App () {
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) return

    const INACTIVITY_LIMIT = 30 * 60 * 1000
    const MAX_SESSION_LIMIT = 12 * 60 * 60 * 1000

    const loginTimeKey = 'adminLoginTime'

    let loginTime = localStorage.getItem(loginTimeKey)

    if (!loginTime) {
      loginTime = Date.now()
      localStorage.setItem(loginTimeKey, loginTime)
    }

    let inactivityTimer
    let maxSessionTimer

    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      localStorage.removeItem('email')
      localStorage.removeItem('userType')
      localStorage.removeItem('isSuperAdmin')
      localStorage.removeItem(loginTimeKey)

      window.location.replace('/')
    }

    const checkSession = () => {
      const elapsed = Date.now() - Number(loginTime)

      if (elapsed >= MAX_SESSION_LIMIT) {
        logout()
        return
      }

      clearTimeout(inactivityTimer)

      inactivityTimer = setTimeout(logout, INACTIVITY_LIMIT)
    }

    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ]

    events.forEach(event => {
      window.addEventListener(event, checkSession)
    })

    checkSession()

    maxSessionTimer = setTimeout(
      logout,
      Math.max(0, MAX_SESSION_LIMIT - (Date.now() - Number(loginTime)))
    )

    return () => {
      clearTimeout(inactivityTimer)
      clearTimeout(maxSessionTimer)

      events.forEach(event => {
        window.removeEventListener(event, checkSession)
      })
    }
  }, [])

  return (
    <BrowserRouter basename='/admin'>
      <Routes>
        <Route path='/' element={<AdminLogin />} />
        <Route path='/*' element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
