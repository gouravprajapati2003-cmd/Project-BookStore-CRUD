import { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './NavBar.jsx'
import HomeCard from './HomeCard.jsx'
import Footer from './Footer.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BookDetail from './BookDetail.jsx'
import { Provider } from 'react-redux'
import store from './app/store.js'
import Cart from './Cart.jsx'
import Contact from './Contact.jsx'
import CheckOut from './CheckOut.jsx'
import MyOrder from './MyOrder.jsx'
import PaymentSuccess from './PaymentSuccess.jsx'
import PaymentFailure from './PaymentFailure.jsx'
import Profile from './Profile.jsx'
import Settings from './Settings.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import { startUserSessionTimer } from './utils/userSession.js'

function App () {
  useEffect(() => {
    const stopTimer = startUserSessionTimer()

    const handleStorageChange = event => {
      if (event.key === 'userToken' && !event.newValue) {
        window.dispatchEvent(new Event('userSessionExpired'))
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      stopTimer()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <NavBar />

        <main
          style={{
            backgroundColor: '#F5F7FA',
            minHeight: '80vh',
            paddingTop: '0px',
            paddingBottom: '30px'
          }}
        >
          <Routes>
            <Route path='/' element={<HomeCard />} />
            <Route path='/user/book/detail/:id' element={<BookDetail />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/checkout' element={<CheckOut />} />
            <Route path='/myorders' element={<MyOrder />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/payment/success' element={<PaymentSuccess />} />
            <Route path='/payment/fail' element={<PaymentFailure />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </Provider>
  )
}

export default App
