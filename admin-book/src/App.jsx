import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import AdminNavbar from './components/AdminNavbar'
import WelcomePage from './pages/WelcomePage/WelcomePage'
import BookList from './pages/books/BookList'
import AddBook from './pages/books/AddBook'
import BookPageForEdit from './pages/books/BookPageForEdit'
import AdminLogin from './pages/LoginSignupPages/AdminLogin'
import CreateDiscount from './pages/Discount/CreateDiscount'
import DiscountList from './pages/Discount/DiscountList'
import DiscountForEdit from './pages/Discount/DiscountForEdit'
import BookDetail from './pages/books/BookDetail'
import UserList from './pages/Users/UserList'
import PincodeList from './pages/PincodeAvailability/PincodeList'
import AddPincode from './pages/PincodeAvailability/AddPincode'
import EditPincode from './pages/PincodeAvailability/EditPincode'
import TransactionList from './pages/Transaction/TransactionList'

function AdminLayout () {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <AdminNavbar />

      <div className='d-flex align-items-start'>
        <Sidebar />

        <main className='flex-grow-1 p-3 p-md-4' style={{ minWidth: 0 }}>
          <Routes>
            <Route path='/admin/dashboard' element={<WelcomePage />} />

            <Route path='/books' element={<BookList />} />
            <Route path='/add/book' element={<AddBook />} />
            <Route path='/edit/book/:id' element={<BookPageForEdit />} />
            <Route path='/book/:id' element={<BookDetail />} />

            <Route path='/discounts' element={<DiscountList />} />
            <Route path='/add/discount' element={<CreateDiscount />} />
            <Route path='/edit/discount/:id' element={<DiscountForEdit />} />

            <Route path='/users' element={<UserList />} />

            <Route path='/pincodes' element={<PincodeList />} />
            <Route path='/add/pincode' element={<AddPincode />} />
            <Route path='/edit/pincode/:id' element={<EditPincode />} />

            <Route path='/transactions' element={<TransactionList />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AdminLogin />} />
        <Route path='/*' element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
