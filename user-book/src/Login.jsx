import { useState } from 'react'
import axios from 'axios'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

function Login ({ show, onHide, onLoginSuccess }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState('login')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const resetMessages = () => {
    setError('')
    setSuccess('')
  }

  const handleClose = () => {
    if (loading) return

    resetMessages()
    setPassword('')
    setConfirmPassword('')
    setMode('login')
    onHide()
  }

  const switchMode = newMode => {
    resetMessages()
    setMode(newMode)
    setPassword('')
    setConfirmPassword('')
  }

  const handleRegister = async event => {
    event.preventDefault()
    resetMessages()

    const normalizedEmail = email.trim().toLowerCase()

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (mobileNo && !/^[0-9]{10}$/.test(mobileNo)) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(`${apiUrl}/create/user`, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNo,
        email: normalizedEmail,
        password
      })

      setSuccess(res.data?.message || 'Registration successful. Please login.')

      setFirstName('')
      setLastName('')
      setMobileNo('')
      setPassword('')
      setConfirmPassword('')
      setEmail(normalizedEmail)

      setMode('login')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const doLogin = async event => {
    event.preventDefault()
    resetMessages()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      setError('Please enter email and password.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(`${apiUrl}/user/login`, {
        email: normalizedEmail,
        password
      })

      if (!res.data?.success || !res.data?.data?.token) {
        setError(res.data?.message || 'Invalid login response.')
        return
      }

      const user = res.data.data

      localStorage.setItem('token', user.token)
      localStorage.setItem('name', user.name || '')
      localStorage.setItem('email', user.email || normalizedEmail)
      localStorage.setItem('isLoggedIn', 'true')

      const shouldReturnToCheckout =
        sessionStorage.getItem('openCheckoutAfterLogin') === 'true' ||
        location.pathname === '/checkout'

      sessionStorage.removeItem('openCheckoutAfterLogin')
      sessionStorage.removeItem('openLoginModal')

      onLoginSuccess?.()

      setPassword('')
      setConfirmPassword('')
      resetMessages()
      setMode('login')
      onHide()

      if (shouldReturnToCheckout) {
        navigate('/checkout', { replace: true })
      }
    } catch (err) {
      console.error('Login API Error:', err.response?.data || err.message)

      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title className='fw-bold'>
          {mode === 'login'
            ? 'Login to G.K.P BookStore'
            : 'Create Your Account'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className='p-4'>
        {error && (
          <Alert variant='danger' dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && <Alert variant='success'>{success}</Alert>}

        {mode === 'login' ? (
          <Form onSubmit={doLogin}>
            <Form.Group className='mb-3'>
              <Form.Label>Email Address</Form.Label>
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

            <div className='text-center mt-3'>
              Don't have an account?{' '}
              <Button
                variant='link'
                className='p-0 text-decoration-none fw-semibold'
                onClick={() => switchMode('register')}
                disabled={loading}
              >
                Register Now
              </Button>
            </div>
          </Form>
        ) : (
          <Form onSubmit={handleRegister}>
            <Form.Group className='mb-3'>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type='text'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder='Enter first name'
                autoComplete='given-name'
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder='Enter last name'
                autoComplete='family-name'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type='tel'
                value={mobileNo}
                onChange={e =>
                  setMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))
                }
                placeholder='Enter 10-digit mobile number'
                autoComplete='tel'
                maxLength={10}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Email Address</Form.Label>
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
                placeholder='Create password'
                autoComplete='new-password'
                minLength={6}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder='Confirm your password'
                autoComplete='new-password'
                minLength={6}
                required
              />
            </Form.Group>

            <Button
              type='submit'
              variant='success'
              className='w-100'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' className='me-2' />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className='text-center mt-3'>
              Already have an account?{' '}
              <Button
                variant='link'
                className='p-0 text-decoration-none fw-semibold'
                onClick={() => switchMode('login')}
                disabled={loading}
              >
                Login
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default Login
