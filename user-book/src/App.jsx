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
    <>
      <Provider store={store}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path='/' element={<HomeCard></HomeCard>}></Route>
            <Route
              path='/user/book/detail/:id'
              element={<BookDetail></BookDetail>}
            ></Route>
            <Route path='/cart' element={<Cart />}></Route>
            <Route path='/checkout' element={<CheckOut></CheckOut>}></Route>
            <Route path='/myorders' element={<MyOrder></MyOrder>}></Route>
            <Route path='/payment/success' element={<PaymentSuccess></PaymentSuccess>}></Route>
            <Route path='/payment/fail' element={<PaymentFailure></PaymentFailure>}></Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
