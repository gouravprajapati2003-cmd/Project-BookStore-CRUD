// import Container from 'react-bootstrap/Container'
// import Nav from 'react-bootstrap/Nav'
// import Navbar from 'react-bootstrap/Navbar'
// import { Button, Form, Badge } from 'react-bootstrap'
// import { useState, useEffect } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import Login from './Login'
// import logo from './assets/logo.png'
// import { useSelector } from 'react-redux'

// function NavBar () {
//   const [showLoginModal, setShowLoginModal] = useState(false)
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [userName, setUserName] = useState('')
//   const [searchBook, setSearchBook] = useState('')

//   const navigate = useNavigate()
//   const { products } = useSelector(state => state.cart)

//   useEffect(() => {
//   const flag = localStorage.getItem('isLoggedIn')

//   if (flag === 'true') {
//     setIsLoggedIn(true)
//     setUserName(localStorage.getItem('name') || '')
//   }

//   // Open login modal when requested
//   if (sessionStorage.getItem('openLoginModal') === 'true') {
//     setShowLoginModal(true)
//     sessionStorage.removeItem('openLoginModal')
//   }
// }, [])


//   function goForLogin () {
//     setShowLoginModal(true)
//   }

//   function handleSearch (e) {
//     e.preventDefault()

//     if (searchBook.trim() !== '') {
//       console.log('Searching:', searchBook.trim())
//     }
//   }

//   function handleLogout () {
//     localStorage.removeItem('isLoggedIn')
//     localStorage.removeItem('name')

//     setIsLoggedIn(false)
//     setUserName('')
//     navigate('/')
//   }

//   function goToCartPage () {
//     navigate('/cart')
//   }

//   return (
//     <>
//       <Navbar
//         expand='xl'
//         className='shadow-sm sticky-top mx-3 mt-2'
//         style={{
//           backgroundColor: '#142D4E',
//           minHeight: '72px',
//           borderRadius: '10px',
//           zIndex: 1030
//         }}
//       >
//         <Container fluid className='px-3'>
//           {/* Logo and Brand */}
//           <Navbar.Brand
//             as={Link}
//             to='/'
//             className='d-flex align-items-center text-white fw-bold me-xl-3'
//           >
//             <img
//               src={logo}
//               width='48'
//               height='48'
//               className='rounded-circle me-2'
//               alt='BookStore Logo'
//               style={{ objectFit: 'cover' }}
//             />

//             <span
//               style={{
//                 fontSize: '1.35rem',
//                 whiteSpace: 'nowrap'
//               }}
//             >
//               G.K.P. BookStore
//             </span>
//           </Navbar.Brand>

//           <Navbar.Toggle
//             aria-controls='navbar-content'
//             className='bg-light'
//           />

//           <Navbar.Collapse id='navbar-content'>
//             {/* Search Bar */}
//             <Form
//               className='d-flex my-3 my-xl-0 mx-xl-3 flex-grow-1'
//               onSubmit={handleSearch}
//               style={{
//                 maxWidth: '350px',
//                 minWidth: '180px'
//               }}
//             >
//               <div className='input-group'>
//                 <Form.Control
//                   type='search'
//                   placeholder='Search books, authors...'
//                   value={searchBook}
//                   onChange={e => setSearchBook(e.target.value)}
//                   className='border-0 shadow-none'
//                   style={{
//                     height: '42px',
//                     minWidth: 0,
//                     borderRadius: '5px 0 0 5px'
//                   }}
//                 />

//                 <Button
//                   type='submit'
//                   variant='light'
//                   aria-label='Search books'
//                   className='border-0'
//                   style={{
//                     color: '#2874f0',
//                     borderRadius: '0 5px 5px 0',
//                     width: '48px'
//                   }}
//                 >
//                   <i className='bi bi-search fs-5'></i>
//                 </Button>
//               </div>
//             </Form>

//             {/* Navigation Links */}
//             <Nav className='align-items-xl-center flex-nowrap'>
//               <Nav.Link
//                 as={Link}
//                 to='/'
//                 className='text-white fw-semibold px-2'
//                 style={{ whiteSpace: 'nowrap' }}
//               >
//                 <i className='bi bi-house-door me-1'></i>
//                 Home
//               </Nav.Link>

//               <Nav.Link
//                 href='/#books'
//                 className='text-white fw-semibold px-2'
//                 style={{ whiteSpace: 'nowrap' }}
//               >
//                 <i className='bi bi-book me-1'></i>
//                 Books
//               </Nav.Link>

//               <Nav.Link
//                 href='/#contact'
//                 className='text-white fw-semibold px-2'
//                 style={{ whiteSpace: 'nowrap' }}
//               >
//                 <i className='bi bi-telephone me-1'></i>
//                 Contact
//               </Nav.Link>

//               <Nav.Link
//                 onClick={goToCartPage}
//                 className='text-white fw-semibold px-2'
//                 style={{
//                   position: 'relative',
//                   cursor: 'pointer',
//                   whiteSpace: 'nowrap'
//                 }}
//               >
//                 <i className='bi bi-cart me-1'></i>
//                 Cart

//                 {products.length > 0 && (
//                   <Badge
//                     bg='danger'
//                     pill
//                     style={{
//                       position: 'absolute',
//                       top: '-2px',
//                       right: '-2px',
//                       fontSize: '0.65rem'
//                     }}
//                   >
//                     {products.length}
//                   </Badge>
//                 )}
//               </Nav.Link>

//               <Nav.Link
//                 as={Link}
//                 to='/myorders'
//                 className='text-white fw-semibold px-2'
//                 style={{ whiteSpace: 'nowrap' }}
//               >
//                 <i className='bi bi-bag-check me-1'></i>
//                 My Orders
//               </Nav.Link>
//             </Nav>

//             {/* User and Logout Section */}
//             <div className='d-flex align-items-center gap-2 ms-xl-3 my-3 my-xl-0'>
//               {isLoggedIn ? (
//                 <>
//                   <span
//                     className='text-white fw-semibold'
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     <i className='bi bi-person-circle me-1'></i>
//                     Welcome, {userName}
//                   </span>

//                   <Button
//                     variant='danger'
//                     size='sm'
//                     className='fw-semibold px-3'
//                     onClick={handleLogout}
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     Logout
//                   </Button>
//                 </>
//               ) : (
//                 <Button
//                   variant='success'
//                   className='fw-semibold px-4'
//                   onClick={goForLogin}
//                   style={{ whiteSpace: 'nowrap' }}
//                 >
//                   <i className='bi bi-person me-1'></i>
//                   Login
//                 </Button>
//               )}
//             </div>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Login Modal */}
//       {showLoginModal && <Login />}
//     </>
//   )
// }

// export default NavBar



import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Button, Form, Badge } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Login from './Login'
import logo from './assets/logo.png'
import { useSelector } from 'react-redux'

function NavBar() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [searchBook, setSearchBook] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const { products } = useSelector(state => state.cart)

  useEffect(() => {
    const flag = localStorage.getItem('isLoggedIn')

    setIsLoggedIn(flag === 'true')
    setUserName(localStorage.getItem('name') || '')

    // Open login modal when checkout requests login
    if (sessionStorage.getItem('openLoginModal') === 'true') {
      sessionStorage.removeItem('openLoginModal')
      setShowLoginModal(true)
    }
  }, [location.pathname])

  function goForLogin() {
    setShowLoginModal(true)
  }

  function handleSearch(e) {
    e.preventDefault()

    if (searchBook.trim() !== '') {
      console.log('Searching:', searchBook.trim())
    }
  }

  function handleLogout() {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    localStorage.removeItem('token')

    setIsLoggedIn(false)
    setUserName('')
    navigate('/')
  }

  function goToCartPage() {
    navigate('/cart')
  }

  function handleLoginSuccess() {
    setIsLoggedIn(true)
    setUserName(localStorage.getItem('name') || '')
    setShowLoginModal(false)

    const returnToCheckout =
      sessionStorage.getItem('openCheckoutAfterLogin') === 'true'

    sessionStorage.removeItem('openCheckoutAfterLogin')
    sessionStorage.removeItem('openLoginModal')

    if (returnToCheckout) {
      navigate('/checkout', { replace: true })
    }
  }

  return (
    <>
      <Navbar
        expand='xl'
        className='shadow-sm sticky-top mx-3 mt-2'
        style={{
          backgroundColor: '#142D4E',
          minHeight: '72px',
          borderRadius: '10px',
          zIndex: 1030
        }}
      >
        <Container fluid className='px-3'>
          {/* Logo and Brand */}
          <Navbar.Brand
            as={Link}
            to='/'
            className='d-flex align-items-center text-white fw-bold me-xl-3'
          >
            <img
              src={logo}
              width='48'
              height='48'
              className='rounded-circle me-2'
              alt='BookStore Logo'
              style={{ objectFit: 'cover' }}
            />

            <span
              style={{
                fontSize: '1.35rem',
                whiteSpace: 'nowrap'
              }}
            >
              G.K.P. BookStore
            </span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls='navbar-content'
            className='bg-light'
          />

          <Navbar.Collapse id='navbar-content'>
            {/* Search Bar */}
            <Form
              className='d-flex my-3 my-xl-0 mx-xl-3 flex-grow-1'
              onSubmit={handleSearch}
              style={{
                maxWidth: '350px',
                minWidth: '180px'
              }}
            >
              <div className='input-group'>
                <Form.Control
                  type='search'
                  placeholder='Search books, authors...'
                  value={searchBook}
                  onChange={e => setSearchBook(e.target.value)}
                  className='border-0 shadow-none'
                  style={{
                    height: '42px',
                    minWidth: 0,
                    borderRadius: '5px 0 0 5px'
                  }}
                />

                <Button
                  type='submit'
                  variant='light'
                  aria-label='Search books'
                  className='border-0'
                  style={{
                    color: '#2874f0',
                    borderRadius: '0 5px 5px 0',
                    width: '48px'
                  }}
                >
                  <i className='bi bi-search fs-5'></i>
                </Button>
              </div>
            </Form>

            {/* Navigation Links */}
            <Nav className='align-items-xl-center flex-nowrap'>
              <Nav.Link
                as={Link}
                to='/'
                className='text-white fw-semibold px-2'
                style={{ whiteSpace: 'nowrap' }}
              >
                <i className='bi bi-house-door me-1'></i>
                Home
              </Nav.Link>

              <Nav.Link
                href='/#books'
                className='text-white fw-semibold px-2'
                style={{ whiteSpace: 'nowrap' }}
              >
                <i className='bi bi-book me-1'></i>
                Books
              </Nav.Link>

              <Nav.Link
                href='/#contact'
                className='text-white fw-semibold px-2'
                style={{ whiteSpace: 'nowrap' }}
              >
                <i className='bi bi-telephone me-1'></i>
                Contact
              </Nav.Link>

              <Nav.Link
                onClick={goToCartPage}
                className='text-white fw-semibold px-2'
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className='bi bi-cart me-1'></i>
                Cart

                {products.length > 0 && (
                  <Badge
                    bg='danger'
                    pill
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      fontSize: '0.65rem'
                    }}
                  >
                    {products.length}
                  </Badge>
                )}
              </Nav.Link>

              <Nav.Link
                as={Link}
                to='/myorders'
                className='text-white fw-semibold px-2'
                style={{ whiteSpace: 'nowrap' }}
              >
                <i className='bi bi-bag-check me-1'></i>
                My Orders
              </Nav.Link>
            </Nav>

            {/* User and Logout Section */}
            <div className='d-flex align-items-center gap-2 ms-xl-3 my-3 my-xl-0'>
              {isLoggedIn ? (
                <>
                  <span
                    className='text-white fw-semibold'
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <i className='bi bi-person-circle me-1'></i>
                    Welcome, {userName}
                  </span>

                  <Button
                    variant='danger'
                    size='sm'
                    className='fw-semibold px-3'
                    onClick={handleLogout}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant='success'
                  className='fw-semibold px-4'
                  onClick={goForLogin}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <i className='bi bi-person me-1'></i>
                  Login
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Login
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}

export default NavBar

