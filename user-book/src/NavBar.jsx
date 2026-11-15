import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Button, Form, Badge, Dropdown } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Login from './Login'
import logo from './assets/logo.png'
import { useSelector } from 'react-redux'

function NavBar () {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [searchBook, setSearchBook] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const { products } = useSelector(state => state.cart)

  // Login Status
  useEffect(() => {
    const flag = localStorage.getItem('isLoggedIn')

    setIsLoggedIn(flag === 'true')
    setUserName(localStorage.getItem('name') || '')

    if (sessionStorage.getItem('openLoginModal') === 'true') {
      sessionStorage.removeItem('openLoginModal')
      setShowLoginModal(true)
    }
  }, [location.pathname])

  // URL Search Sync
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchBook(params.get('search') || '')
  }, [location.search])

  // Live Search
  function handleSearch (e) {
    const value = e.target.value

    setSearchBook(value)

    if (value.trim()) {
      navigate('/?search=' + encodeURIComponent(value), {
        replace: true
      })
    } else {
      navigate('/', { replace: true })
    }
  }

  function goForLogin () {
    setShowLoginModal(true)
  }

  // Logout
  function handleLogout () {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    localStorage.removeItem('token')

    setIsLoggedIn(false)
    setUserName('')
    navigate('/')
  }

  function goToCartPage () {
    navigate('/cart')
  }

  // Login Success
  function handleLoginSuccess () {
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

  // Profile Navigation
  function goToProfile () {
    navigate('/profile')
  }

  function goToSettings () {
    navigate('/settings')
  }

  function goToAdmin () {
    navigate('/admin/')
  }

  return (
    <>
      <style>
        {`
          .store-navbar {
            background: #142D4E;
            border-radius: 10px;
          }

          .store-navbar .nav-link {
            transition: color 0.2s ease;
          }

          .store-navbar .nav-link:hover {
            color: #8fe7d8 !important;
          }

          .navbar-search {
            max-width: 380px;
            min-width: 180px;
          }

          .navbar-search .form-control {
            height: 42px;
            border: none;
            box-shadow: none;
          }

          .profile-dropdown-toggle {
            background: #ffffff !important;
            color: #142D4E !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 8px 13px !important;
            font-weight: 600 !important;
          }

          .profile-dropdown-toggle:hover,
          .profile-dropdown-toggle:focus {
            background: #e6f4f1 !important;
            color: #0F766E !important;
          }

          .profile-menu {
            min-width: 205px;
            padding: 8px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }

          .profile-menu .dropdown-item {
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
          }

          .profile-menu .dropdown-item:hover {
            background: #e8f5f2;
            color: #0F766E;
          }

          @media (max-width: 1199px) {
            .navbar-search {
              max-width: 100%;
            }
          }
        `}
      </style>

      <Navbar
        expand='xl'
        className='store-navbar shadow-sm sticky-top mx-3 mt-2'
        style={{
          minHeight: '72px',
          zIndex: 1030
        }}
      >
        <Container fluid className='px-3'>
          {/* Logo */}
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

            <span style={{ fontSize: '1.3rem', whiteSpace: 'nowrap' }}>
              G.K.P. BookStore
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls='navbar-content' className='bg-light' />

          <Navbar.Collapse id='navbar-content'>
            {/* Search */}
            <Form
              className='d-flex my-3 my-xl-0 mx-xl-3 flex-grow-1 navbar-search'
              onSubmit={e => e.preventDefault()}
            >
              <div className='input-group'>
                <Form.Control
                  type='text'
                  placeholder='Search books, authors...'
                  value={searchBook}
                  onChange={handleSearch}
                  aria-label='Search books and authors'
                  style={{
                    borderRadius: '5px 0 0 5px'
                  }}
                />

                {searchBook && (
                  <Button
                    type='button'
                    variant='light'
                    onClick={() => {
                      setSearchBook('')
                      navigate('/', { replace: true })
                    }}
                    aria-label='Clear search'
                    title='Clear Search'
                  >
                    <i className='bi bi-x-lg'></i>
                  </Button>
                )}

                <span
                  className='input-group-text bg-white text-primary'
                  style={{
                    borderRadius: '0 5px 5px 0'
                  }}
                >
                  <i className='bi bi-search'></i>
                </span>
              </div>
            </Form>

            {/* Navigation Links */}
            <Nav className='align-items-xl-center flex-nowrap'>
              <Nav.Link
                as={Link}
                to='/'
                className='text-white fw-semibold px-2'
              >
                <i className='bi bi-house-door me-1'></i>
                Home
              </Nav.Link>

              <Nav.Link
                href='/#contact'
                className='text-white fw-semibold px-2'
              >
                <i className='bi bi-telephone me-1'></i>
                Contact
              </Nav.Link>

              <Nav.Link
                onClick={goToCartPage}
                className='text-white fw-semibold px-2'
                style={{ position: 'relative', cursor: 'pointer' }}
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
              >
                <i className='bi bi-bag-check me-1'></i>
                My Orders
              </Nav.Link>
            </Nav>

            {/* Profile Dropdown */}
            <div className='ms-xl-3 my-3 my-xl-0'>
              <Dropdown align='end'>
                <Dropdown.Toggle
                  id='profile-dropdown'
                  className='profile-dropdown-toggle'
                >
                  <i className='bi bi-person-circle me-2 fs-5'></i>

                  {isLoggedIn
                    ? userName.split(' ')[0] || 'My Account'
                    : 'My Account'}
                </Dropdown.Toggle>

                <Dropdown.Menu className='profile-menu'>
                  <Dropdown.Header className='text-muted fw-semibold'>
                    {isLoggedIn
                      ? `Welcome, ${userName}`
                      : 'Welcome to G.K.P BookStore'}
                  </Dropdown.Header>

                  <Dropdown.Divider />

                  <Dropdown.Item onClick={goToProfile}>
                    <i className='bi bi-person me-2'></i>
                    My Profile
                  </Dropdown.Item>

                  <Dropdown.Item onClick={goToAdmin}>
                    <i className='bi bi-speedometer2 me-2'></i>
                    Admin Login
                  </Dropdown.Item>

                  <Dropdown.Item onClick={goToSettings}>
                    <i className='bi bi-gear me-2'></i>
                    Settings
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  {isLoggedIn ? (
                    <Dropdown.Item
                      onClick={handleLogout}
                      className='text-danger'
                    >
                      <i className='bi bi-box-arrow-right me-2'></i>
                      Logout
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item
                      onClick={goForLogin}
                      className='fw-semibold'
                      style={{ color: '#0F766E' }}
                    >
                      <i className='bi bi-box-arrow-in-right me-2'></i>
                      Login
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
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
