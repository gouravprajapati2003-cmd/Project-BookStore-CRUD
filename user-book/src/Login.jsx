import { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

function Login () {
  let [show, setShow] = useState(true)
  let [showLoginWindow, setShowLoginWindow] = useState(true)
  let [showSignupWindow, setSignupWindow] = useState(false)
  let [firstName, setFirstName] = useState('')
  let [lastName, setLastName] = useState('')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [confirmPassword, setConfirmPassword] = useState('')
  let [title, setTitle] = useState('Login')

  function handleClose () {
    setShow(false)
  }
  function openSignupWindow () {
    setShowLoginWindow(false)
    setSignupWindow(true)
    setTitle('Sign Up')
  }
  function openLoginWindow () {
    setShowLoginWindow(true)
    setSignupWindow(false)
    setTitle('Login')
  }
  function doLogin () {
    let data = {
      email: email,
      password: password
    }
    axios({
      url: apiUrl + '/user/login',
      method: 'Post',
      data: data
    })
      .then((res) => {
        alert('Login SuccessFull...') // this is replace by madal 
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('name', res.data.data.name);
        localStorage.setItem('email', res.data.data.email);
        localStorage.setItem('isLoggedIn', true);
        window.location.reload();
      })
      .catch(err => {
        alert(err)
      })
  }

  function signUp (e) {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Password and Confirm Password do not match')
      return
    }

    let data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }

    axios({
      url: apiUrl + '/create/user',
      method: 'POST',
      data: data
    })
      .then(res => {
        alert(res.data.message)

        // Form clear
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Something went wrong')
      })
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className='w-100 text-center'>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {showLoginWindow && (
          <Form>
            <Form.Group className='mb-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='text'
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-2'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className='text-center'>
              <Button variant='success' className='mt-2' onClick={doLogin}>
                Login
              </Button>
              <br />
              <span>Do you have not an account ?</span>
              <span
                className='text-danger text-decoration-underline fw-bold ms-2'
                onClick={openSignupWindow}
              >
                Create Account
              </span>
            </div>
          </Form>
        )}
        {showSignupWindow && (
          <Form onSubmit={signUp}>
            <Form.Group className='mb-2'>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type='text'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-2'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-2'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-2'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <div className='text-center mt-3'>
              <Button variant='success' type='submit'>
                Sign Up
              </Button>
              <br />
              <span
                className='text-danger text-decoration-underline fw-bold mt-2'
                onClick={openLoginWindow}
              >
                Go for Login
              </span>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default Login
