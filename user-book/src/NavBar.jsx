import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Button } from 'react-bootstrap'
import { useState } from 'react'
import Login from './Login'


function NavBar () {
  let [showLoginModal, setShowLoginModal] = useState(false);
  function goForLogin() {
    setShowLoginModal(true)
  }
  return (
    <>
    <Navbar bg='dark' data-bs-theme='dark'>
      <Container>
        <Navbar.Brand href='#home'>RDEC</Navbar.Brand>
        <Nav className='me-auto'>
          <Nav.Link href='#home'>Home</Nav.Link>
          <Nav.Link href='#books'>Books</Nav.Link>
          <Nav.Link href='#contact us'>Contact Us</Nav.Link>
        </Nav>
        <Button variant='success' className='ms-1' onClick={goForLogin}>Login</Button>
      </Container>
    </Navbar>
    {showLoginModal && <Login></Login>}
    </>
  )
}

export default NavBar
