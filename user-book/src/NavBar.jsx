import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Button } from 'react-bootstrap'
import { useState } from 'react'
import Login from './Login'
import logo from './assets/logo.png'

function NavBar () {
  let [showLoginModal, setShowLoginModal] = useState(false)
  function goForLogin () {
    setShowLoginModal(true)
  }
  return (
    <>
      <Navbar bg='dark' data-bs-theme='dark'>
        <Container fluid className='px-2'>
          {' '}
          <Navbar.Brand className='fw-bold fs-4'>
            <img
              src={logo}
              width='40'
              height='40'
              className='d-inline-block align-middle me-3'
              alt='BookStore Logo'
            />
            G.K.P BookStore
          </Navbar.Brand>
          <Nav className='me-auto'>
            <Nav.Link href='#home'>Home</Nav.Link>
            <Nav.Link href='#books'>Books</Nav.Link>
            <Nav.Link href='#contact us'>Contact Us</Nav.Link>
          </Nav>
          <Button variant='success' className='ms-1' onClick={goForLogin}>
            Login
          </Button>
        </Container>
      </Navbar>
      {showLoginModal && <Login></Login>}
    </>
  )
}

export default NavBar
