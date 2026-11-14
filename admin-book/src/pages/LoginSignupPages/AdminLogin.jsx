import { useState } from 'react'
import logo from '../../assets/logo.png'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner
} from 'react-bootstrap'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

function AdminLogin () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showSpinner, setShowSpinner] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin (e) {
    e.preventDefault()
    setErrorMsg('')

    if (!email.trim() || !password) {
      setErrorMsg('Please enter email and password.')
      return
    }

    if (!apiUrl) {
      setErrorMsg('API URL is missing. Please check your .env file.')
      return
    }

    try {
      setShowSpinner(true)

      const backendUrl = `${apiUrl.replace(/\/+$/, '')}/admin/login`

      const res = await axios.post(backendUrl, {
        email: email.trim().toLowerCase(),
        password
      })

      if (res.data.success) {
        const admin = res.data.data

        localStorage.setItem('token', admin.token)
        localStorage.setItem('name', admin.name)
        localStorage.setItem('email', admin.email)
        localStorage.setItem('userType', admin.userType)
        localStorage.setItem('isSuperAdmin', String(admin.isSuperAdmin))

        window.location.href = '/admin/dashboard'
      } else {
        setErrorMsg(res.data.message || 'Invalid credentials.')
      }
    } catch (err) {
      console.error('Admin Login Error:', err)

      if (err.response) {
        setErrorMsg(
          err.response.data?.message ||
            `Login failed. Status: ${err.response.status}`
        )
      } else if (err.request) {
        setErrorMsg('Backend server is not responding. Please try again.')
      } else {
        setErrorMsg(err.message || 'Something went wrong.')
      }
    } finally {
      setShowSpinner(false)
    }
  }

  return (
    <Container
      fluid
      className='min-vh-100 d-flex align-items-center justify-content-center py-4'
      style={{
        background:
          'radial-gradient(circle at top left, #254b76, transparent 40%), linear-gradient(135deg, #071526, #102d4a, #071526)'
      }}
    >
      <Row className='w-100 justify-content-center align-items-center'>
        <Col xs={11} sm={9} md={7} lg={5} xl={4}>
          <Card
            className='border-0 shadow-lg overflow-hidden'
            style={{
              borderRadius: '22px',
              background: 'rgba(255,255,255,0.97)'
            }}
          >
            <Card.Body className='p-4 p-md-5'>
              {/* Logo and Branding */}
              <div className='text-center mb-4'>
                <div className='mb-3'>
                  <img
                    src={logo}
                    alt='G.K.P BookStore Logo'
                    style={{
                      width: '85px',
                      height: '85px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #16b6a4',
                      boxShadow: '0 5px 15px rgba(8,127,140,0.25)'
                    }}
                  />
                </div>

                <h3 className='fw-bold mb-1' style={{ color: '#142d4e' }}>
                  G.K.P BookStore
                </h3>

                <p className='text-secondary mb-0'>Admin Control Panel</p>
              </div>

              <hr className='mb-4' />

              <div className='mb-4'>
                <h4 className='fw-bold mb-1' style={{ color: '#142d4e' }}>
                  Welcome Back!
                </h4>
                <p className='text-secondary small mb-0'>
                  Sign in to access your admin dashboard.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className='alert alert-danger py-2 small'>
                  <i className='bi bi-exclamation-circle me-2'></i>
                  {errorMsg}
                </div>
              )}

              <Form onSubmit={handleLogin}>
                {/* Email */}
                <Form.Group className='mb-3'>
                  <Form.Label className='fw-semibold'>Email Address</Form.Label>

                  <div className='position-relative'>
                    <i
                      className='bi bi-envelope position-absolute'
                      style={{
                        left: '14px',
                        top: '12px',
                        color: '#718096'
                      }}
                    ></i>

                    <Form.Control
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className='py-2 ps-5'
                      autoComplete='username'
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                </Form.Group>

                {/* Password */}
                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold'>Password</Form.Label>

                  <div className='position-relative'>
                    <i
                      className='bi bi-lock position-absolute'
                      style={{
                        left: '14px',
                        top: '12px',
                        color: '#718096'
                      }}
                    ></i>

                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className='py-2 ps-5 pe-5'
                      autoComplete='current-password'
                      required
                      style={{ borderRadius: '10px' }}
                    />

                    <i
                      className={`bi ${
                        showPassword ? 'bi-eye-slash' : 'bi-eye'
                      } position-absolute`}
                      role='button'
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        right: '14px',
                        top: '12px',
                        color: '#718096'
                      }}
                    ></i>
                  </div>
                </Form.Group>
                {/* Forgot Password */}
                <div className='d-flex justify-content-end mb-4'>
                  <a
                    href='#'
                    onClick={e => {
                      e.preventDefault()
                      alert('Forgot Password feature coming soon!')
                    }}
                    className='text-decoration-none fw-semibold small'
                    style={{ color: '#087f8c' }}
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Login Button */}
                <div className='d-grid'>
                  <Button
                    type='submit'
                    disabled={showSpinner}
                    className='py-2 fw-semibold border-0'
                    style={{
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg,#087f8c,#16b6a4)',
                      boxShadow: '0 5px 15px rgba(8,127,140,0.25)'
                    }}
                  >
                    {showSpinner ? (
                      <>
                        <Spinner
                          animation='border'
                          size='sm'
                          className='me-2'
                        />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className='bi bi-box-arrow-in-right me-2'></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              <div className='text-center mt-4'>
                <small className='text-secondary'>
                  <i className='bi bi-shield-lock me-1'></i>
                  Secure Admin Authentication
                </small>
              </div>
            </Card.Body>
          </Card>

          <p className='text-center text-white-50 small mt-3'>
            © {new Date().getFullYear()} G.K.P BookStore. All rights reserved.
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminLogin
