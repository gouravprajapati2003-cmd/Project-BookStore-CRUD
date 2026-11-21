import { useState } from 'react'
import logo from '../../assets/logo.png'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  InputGroup
} from 'react-bootstrap'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

function AdminLogin () {
  const [mode, setMode] = useState('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Password Show / Hide states
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [showSpinner, setShowSpinner] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const backendUrl = apiUrl?.replace(/\/+$/, '')

  const resetMessages = () => {
    setErrorMsg('')
    setSuccessMsg('')
  }

  const changeMode = newMode => {
    resetMessages()
    setMode(newMode)
    setOtp('')
    setResetToken('')
    setNewPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  // ADMIN LOGIN
  async function handleLogin (e) {
    e.preventDefault()
    resetMessages()

    if (!email.trim() || !password) {
      setErrorMsg('Please enter email and password.')
      return
    }

    if (!backendUrl) {
      setErrorMsg('API URL is missing. Please check your .env file.')
      return
    }

    try {
      setShowSpinner(true)

      const res = await axios.post(`${backendUrl}/admin/login`, {
        email: email.trim().toLowerCase(),
        password
      })

      if (res.data.success && res.data.data?.token) {
        const admin = res.data.data
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminName')
        localStorage.removeItem('adminEmail')
        localStorage.removeItem('adminUserType')
        localStorage.removeItem('adminIsSuperAdmin')
        localStorage.removeItem('adminLoginTime')

        localStorage.setItem('adminToken', admin.token)
        localStorage.setItem('adminName', admin.name)
        localStorage.setItem('adminEmail', admin.email)
        localStorage.setItem('adminUserType', admin.userType)
        localStorage.setItem('adminIsSuperAdmin', String(admin.isSuperAdmin))
        localStorage.setItem('adminLoginTime', Date.now().toString())

        window.location.href = '/admin/dashboard'
      } else {
        setErrorMsg(res.data.message || 'Invalid credentials.')
      }
    } catch (err) {
      console.error('Admin Login Error:', err)

      setErrorMsg(
        err.response?.data?.message || 'Login failed. Please try again.'
      )
    } finally {
      setShowSpinner(false)
    }
  }

  // SEND OTP
  async function handleSendOtp (e) {
    e.preventDefault()
    resetMessages()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setErrorMsg('Please enter your registered email.')
      return
    }

    try {
      setShowSpinner(true)

      const res = await axios.post(`${backendUrl}/admin/password/forgot`, {
        email: normalizedEmail
      })

      setSuccessMsg(
        res.data?.message || 'If an active account exists, an OTP will be sent.'
      )

      setMode('verifyOtp')
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Unable to send OTP.')
    } finally {
      setShowSpinner(false)
    }
  }

  // VERIFY OTP
  async function handleVerifyOtp (e) {
    e.preventDefault()
    resetMessages()

    if (!/^\d{6}$/.test(otp)) {
      setErrorMsg('Please enter a valid 6-digit OTP.')
      return
    }

    try {
      setShowSpinner(true)

      const res = await axios.post(`${backendUrl}/admin/password/verify-otp`, {
        email: email.trim().toLowerCase(),
        otp
      })

      if (!res.data?.success || !res.data?.data?.resetToken) {
        setErrorMsg(res.data?.message || 'OTP verification failed.')
        return
      }

      setResetToken(res.data.data.resetToken)
      setSuccessMsg('OTP verified successfully.')
      setMode('resetPassword')
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Invalid OTP. Please try again.'
      )
    } finally {
      setShowSpinner(false)
    }
  }

  // RESET PASSWORD
  async function handleResetPassword (e) {
    e.preventDefault()
    resetMessages()

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New Password and Confirm Password do not match.')
      return
    }

    try {
      setShowSpinner(true)

      const res = await axios.post(`${backendUrl}/admin/password/reset`, {
        resetToken,
        newPassword
      })

      setSuccessMsg(
        res.data?.message || 'Password reset successfully. Please login.'
      )

      setPassword('')
      setOtp('')
      setResetToken('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
      setMode('login')
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Unable to reset password.')
    } finally {
      setShowSpinner(false)
    }
  }

  const heading = {
    login: 'Welcome Back!',
    forgot: 'Forgot Password?',
    verifyOtp: 'Verify Your Email',
    resetPassword: 'Create New Password'
  }

  const subHeading = {
    login: 'Sign in to access your admin dashboard.',
    forgot: 'Enter your registered admin email.',
    verifyOtp: 'Enter the 6-digit OTP sent to your email.',
    resetPassword: 'Choose a new secure password.'
  }

  const inputStyle = {
    borderRadius: '10px'
  }

  const buttonStyle = {
    borderRadius: '10px',
    background: 'linear-gradient(135deg,#087f8c,#16b6a4)',
    boxShadow: '0 5px 15px rgba(8,127,140,0.25)'
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
                  {heading[mode]}
                </h4>
                <p className='text-secondary small mb-0'>{subHeading[mode]}</p>
              </div>

              {errorMsg && (
                <Alert
                  variant='danger'
                  dismissible
                  onClose={() => setErrorMsg('')}
                  className='py-2 small'
                >
                  {errorMsg}
                </Alert>
              )}

              {successMsg && (
                <Alert variant='success' className='py-2 small'>
                  {successMsg}
                </Alert>
              )}

              {/* LOGIN */}
              {mode === 'login' && (
                <Form onSubmit={handleLogin}>
                  <Form.Group className='mb-3'>
                    <Form.Label className='fw-semibold'>
                      Email Address
                    </Form.Label>

                    <Form.Control
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete='username'
                      required
                      style={inputStyle}
                      className='py-2'
                    />
                  </Form.Group>

                  <Form.Group className='mb-2'>
                    <Form.Label className='fw-semibold'>Password</Form.Label>

                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete='current-password'
                        required
                        style={inputStyle}
                        className='py-2'
                      />

                      <Button
                        variant='outline-secondary'
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        <i
                          className={`bi ${
                            showPassword ? 'bi-eye-slash' : 'bi-eye'
                          }`}
                        ></i>
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <div className='d-flex justify-content-end mb-4'>
                    <Button
                      variant='link'
                      className='p-0 text-decoration-none fw-semibold small'
                      style={{ color: '#087f8c' }}
                      onClick={() => changeMode('forgot')}
                      disabled={showSpinner}
                    >
                      Forgot Password?
                    </Button>
                  </div>

                  <div className='d-grid'>
                    <Button
                      type='submit'
                      disabled={showSpinner}
                      className='py-2 fw-semibold border-0'
                      style={buttonStyle}
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
              )}

              {/* FORGOT PASSWORD */}
              {mode === 'forgot' && (
                <Form onSubmit={handleSendOtp}>
                  <div
                    className='text-center mb-4 p-3 rounded'
                    style={{ background: '#f0f5fa' }}
                  >
                    <i
                      className='bi bi-shield-lock'
                      style={{ fontSize: '35px', color: '#087f8c' }}
                    ></i>
                    <p className='small text-muted mb-0 mt-2'>
                      OTP will be sent to your registered admin email.
                    </p>
                  </div>

                  <Form.Group className='mb-4'>
                    <Form.Label className='fw-semibold'>
                      Registered Email Address
                    </Form.Label>
                    <Form.Control
                      type='email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder='Enter your registered email'
                      required
                      autoComplete='email'
                      className='py-2'
                      style={inputStyle}
                    />
                  </Form.Group>

                  <div className='d-grid'>
                    <Button
                      type='submit'
                      disabled={showSpinner}
                      className='py-2 fw-semibold border-0'
                      style={buttonStyle}
                    >
                      {showSpinner ? (
                        <>
                          <Spinner size='sm' className='me-2' />
                          Sending OTP...
                        </>
                      ) : (
                        'Send OTP'
                      )}
                    </Button>
                  </div>

                  <div className='text-center mt-3'>
                    <Button
                      variant='link'
                      className='text-decoration-none'
                      style={{ color: '#087f8c' }}
                      onClick={() => changeMode('login')}
                      disabled={showSpinner}
                    >
                      <i className='bi bi-arrow-left me-1'></i>
                      Back to Login
                    </Button>
                  </div>
                </Form>
              )}

              {/* VERIFY OTP */}
              {mode === 'verifyOtp' && (
                <Form onSubmit={handleVerifyOtp}>
                  <div
                    className='text-center mb-4 p-3 rounded'
                    style={{ background: '#f0f5fa' }}
                  >
                    <i
                      className='bi bi-envelope-check'
                      style={{ fontSize: '35px', color: '#087f8c' }}
                    ></i>
                    <p className='small text-muted mt-2 mb-1'>OTP sent to</p>
                    <strong>{email}</strong>
                  </div>

                  <Form.Group className='mb-4'>
                    <Form.Label className='fw-semibold'>
                      Enter 6-Digit OTP
                    </Form.Label>
                    <Form.Control
                      type='text'
                      inputMode='numeric'
                      autoComplete='one-time-code'
                      value={otp}
                      onChange={e =>
                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                      placeholder='000000'
                      maxLength={6}
                      required
                      className='py-2 text-center fw-bold'
                      style={{
                        ...inputStyle,
                        fontSize: '22px',
                        letterSpacing: '8px'
                      }}
                    />
                    <Form.Text className='text-muted'>
                      OTP is valid for 5 minutes.
                    </Form.Text>
                  </Form.Group>

                  <div className='d-grid'>
                    <Button
                      type='submit'
                      disabled={showSpinner || otp.length !== 6}
                      className='py-2 fw-semibold border-0'
                      style={buttonStyle}
                    >
                      {showSpinner ? (
                        <>
                          <Spinner size='sm' className='me-2' />
                          Verifying...
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </Button>
                  </div>

                  <div className='text-center mt-3'>
                    <Button
                      variant='link'
                      className='text-decoration-none'
                      style={{ color: '#087f8c' }}
                      onClick={() => changeMode('forgot')}
                      disabled={showSpinner}
                    >
                      Change Email / Request OTP Again
                    </Button>
                  </div>
                </Form>
              )}

              {/* RESET PASSWORD */}
              {mode === 'resetPassword' && (
                <Form onSubmit={handleResetPassword}>
                  <div
                    className='text-center mb-4 p-3 rounded'
                    style={{ background: '#eef8f1' }}
                  >
                    <i
                      className='bi bi-shield-check'
                      style={{ fontSize: '35px', color: '#198754' }}
                    ></i>
                    <p className='small text-success mb-0 mt-2'>
                      Email verified successfully.
                    </p>
                  </div>

                  <Form.Group className='mb-3'>
                    <Form.Label className='fw-semibold'>
                      New Password
                    </Form.Label>

                    <InputGroup>
                      <Form.Control
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder='Enter new password'
                        autoComplete='new-password'
                        minLength={8}
                        required
                        className='py-2'
                        style={inputStyle}
                      />

                      <Button
                        variant='outline-secondary'
                        type='button'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        title={
                          showNewPassword ? 'Hide Password' : 'Show Password'
                        }
                      >
                        <i
                          className={`bi ${
                            showNewPassword ? 'bi-eye-slash' : 'bi-eye'
                          }`}
                        ></i>
                      </Button>
                    </InputGroup>

                    <Form.Text className='text-muted'>
                      Minimum 8 characters.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label className='fw-semibold'>
                      Confirm New Password
                    </Form.Label>

                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder='Confirm new password'
                        autoComplete='new-password'
                        minLength={8}
                        required
                        className='py-2'
                        style={inputStyle}
                      />

                      <Button
                        variant='outline-secondary'
                        type='button'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        title={
                          showConfirmPassword
                            ? 'Hide Password'
                            : 'Show Password'
                        }
                      >
                        <i
                          className={`bi ${
                            showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'
                          }`}
                        ></i>
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <div className='d-grid'>
                    <Button
                      type='submit'
                      disabled={showSpinner}
                      className='py-2 fw-semibold border-0'
                      style={buttonStyle}
                    >
                      {showSpinner ? (
                        <>
                          <Spinner size='sm' className='me-2' />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <i className='bi bi-check-circle me-2'></i>
                          Reset Password
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )}

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
