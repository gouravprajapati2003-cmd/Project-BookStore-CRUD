import { useState } from 'react'
import axios from 'axios'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

function Login ({ show, onHide, onLoginSuccess }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setError('')
    setPassword('')
    onHide()
  }

  const doLogin = async event => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Email aur password dono enter karein.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(`${apiUrl}/user/login`, {
        email: email.trim(),
        password
      })

      // Apne login API ke response structure ke according verify karein.
      const user = res.data?.data

      if (!user?.token) {
        throw new Error('Login response mein token nahi mila.')
      }

      localStorage.setItem('token', user.token)
      localStorage.setItem('name', user.name || '')
      localStorage.setItem('email', user.email || email.trim())
      localStorage.setItem('isLoggedIn', 'true')

      const shouldReturnToCheckout =
        sessionStorage.getItem('openCheckoutAfterLogin') === 'true'

      sessionStorage.removeItem('openCheckoutAfterLogin')
      sessionStorage.removeItem('openLoginModal')

      onLoginSuccess?.()
      handleClose()

      if (shouldReturnToCheckout) {
        navigate('/checkout', { replace: true })
      } else if (location.pathname === '/checkout') {
        navigate('/checkout', { replace: true })
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login to BookStore</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant='danger'>{error}</Alert>}

        <Form onSubmit={doLogin}>
          <Form.Group className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='Enter your email'
              autoComplete='email'
              required
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Enter your password'
              autoComplete='current-password'
              required
            />
          </Form.Group>

          <Button
            type='submit'
            variant='primary'
            className='w-100'
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size='sm' className='me-2' />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default Login
