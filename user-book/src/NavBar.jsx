import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Button, Form, Badge } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from './Login'
import logo from './assets/logo.png'
import { useSelector } from 'react-redux'

function NavBar () {
  let [showLoginModal, setShowLoginModal] = useState(false)
  let [isLoggedIn, setIsLoggedIn] = useState(false)
  let [userName, setUserName] = useState('')
  let [searchBook, setSearchBook] = useState('')
  let navigate = useNavigate()
  const { products } = useSelector(state => state.cart)
  console.log(products)
  useEffect(() => {
    let flag = localStorage.getItem('isLoggedIn')

    if (flag) {
      setIsLoggedIn(true)
      setUserName(localStorage.getItem('name'))
    }
  }, [])

  function goForLogin () {
    setShowLoginModal(true)
  }

  function handleSearch (e) {
    e.preventDefault()

    if (searchBook.trim() !== '') {
      console.log('Searching:', searchBook)
    }
  }

  function handleLogout () {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('name')

    setIsLoggedIn(false)
    setUserName('')
  }
  function goToCartPage () {
    navigate('/cart')
  }

  return (
    <>
      <Navbar
        expand='lg'
        className='shadow-sm sticky-top'
        style={{
          backgroundColor: 'black',
          minHeight: '65px'
        }}
      >
        <Container fluid className='px-3'>
          {/* Logo + Brand */}
          <Navbar.Brand
            href='/'
            className='d-flex align-items-center text-white fw-bold'
          >
            <img
              src={logo}
              width='45'
              height='45'
              className='rounded-circle me-2'
              alt='BookStore Logo'
              style={{
                objectFit: 'cover'
              }}
            />

            <span className='fs-5'>G.K.P. BookStore</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls='navbar-content' />

          <Navbar.Collapse id='navbar-content'>
            {/* Search Bar */}
            <Form
              className='d-flex mx-lg-4 my-2 my-lg-0 flex-grow-1'
              onSubmit={handleSearch}
              style={{
                maxWidth: '600px'
              }}
            >
              <div className='input-group'>
                <Form.Control
                  type='search'
                  placeholder='Search for books, authors and more'
                  value={searchBook}
                  onChange={e => setSearchBook(e.target.value)}
                  className='border-0 shadow-none'
                  style={{
                    height: '42px',
                    borderRadius: '4px 0 0 4px'
                  }}
                />

                <Button
                  type='submit'
                  variant='light'
                  className='border-0'
                  style={{
                    color: '#2874f0',
                    borderRadius: '0 4px 4px 0',
                    width: '50px'
                  }}
                >
                  <i className='bi bi-search fs-5'></i>
                </Button>
              </div>
            </Form>

            {/* Navigation */}
            <Nav className='align-items-lg-center'>
              <Nav.Link href='/' className='text-white fw-semibold mx-1'>
                <i className='bi bi-house-door me-1'></i>
                Home
              </Nav.Link>

              <Nav.Link href='#books' className='text-white fw-semibold mx-1'>
                <i className='bi bi-book me-1'></i>
                Books
              </Nav.Link>

              <Nav.Link href='#contact' className='text-white fw-semibold mx-1'>
                <i className='bi bi-telephone me-1'></i>
                Contact
              </Nav.Link>
              <Nav.Link
                className='text-white'
                onClick={goToCartPage}
                style={{ position: 'relative' }}
              >
                <i className='bi bi-cart'></i>Cart
                {products.length > 0 && (
                  <Badge
                    bg='danger'
                    pill
                    style={{
                      position: 'absolute',
                      top: '0px',
                      right: '-8.0px',
                      fontSize: '0.7rem'
                    }}
                  >
                    {products.length}
                  </Badge>
                )}
              </Nav.Link>
              <Nav.Link
                href='/myorders'
                style={{ color: 'white' }}
                className='text-white fw-semibold mx-1'
              >
                My Orders
              </Nav.Link>
            </Nav>

            {/* Login / User Section */}
            <div className='d-flex align-items-center ms-lg-3 mt-2 mt-lg-0'>
              {isLoggedIn ? (
                <>
                  <span className='text-white fw-semibold me-3'>
                    <i className='bi bi-person-circle me-1'></i>
                    Welcome, {userName}
                  </span>

                  <Button
                    variant='danger'
                    size='sm'
                    className='fw-semibold'
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant='success'
                  className='fw-semibold px-4'
                  onClick={goForLogin}
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
      {showLoginModal && <Login />}
    </>
  )
}

export default NavBar
