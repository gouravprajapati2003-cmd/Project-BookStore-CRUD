import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './NavBar.jsx'
import HomeCard from './HomeCard.jsx'
import Footer from './Footer.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BookDetail from './BookDetail.jsx'
import { Provider } from 'react-redux'
import store from './app/store.js'
import Cart from './Cart.jsx'
import CheckOut from './CheckOut.jsx'
import MyOrder from './MyOrder.jsx'
import PaymentSuccess from './PaymentSuccess.jsx'
import PaymentFailure from './PaymentFailure.jsx'

function App () {
  return (
    <Provider store={store}>
      <BrowserRouter>
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

            <Route path='/checkout' element={<CheckOut />} />

            <Route path='/myorders' element={<MyOrder />} />

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
