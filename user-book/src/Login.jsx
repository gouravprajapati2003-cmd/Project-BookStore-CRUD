import { useState } from 'react'
import axios from 'axios'
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup
} from 'react-bootstrap'
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

  // Password Show / Hide states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // Forgot Password states
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const resetMessages = () => {
    setError('')
    setSuccess('')
  }

  const resetForgotPassword = () => {
    setOtp('')
    setResetToken('')
    setNewPassword('')
    setConfirmNewPassword('')
    setShowNewPassword(false)
    setShowConfirmNewPassword(false)
  }

  const handleClose = () => {
    if (loading) return

    resetMessages()
    resetForgotPassword()
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setMode('login')
    onHide()
  }

  const switchMode = newMode => {
    resetMessages()
    setMode(newMode)
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    resetForgotPassword()
  }

  // REGISTER
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
      setShowPassword(false)
      setShowConfirmPassword(false)
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

  // LOGIN
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
      setShowPassword(false)
      setShowConfirmPassword(false)
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

  // FORGOT PASSWORD - SEND OTP
  const handleSendOtp = async event => {
    event.preventDefault()
    resetMessages()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setError('Please enter your registered email address.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(`${apiUrl}/user/password/forgot`, {
        email: normalizedEmail
      })

      setSuccess(
        res.data?.message || 'If an active account exists, an OTP will be sent.'
      )

      setMode('verifyOtp')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to send OTP. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // VERIFY OTP
  const handleVerifyOtp = async event => {
    event.preventDefault()
    resetMessages()

    if (!/^[0-9]{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(`${apiUrl}/user/password/verify-otp`, {
        email: email.trim().toLowerCase(),
        otp
      })

      if (!res.data?.success || !res.data?.data?.resetToken) {
        setError(res.data?.message || 'OTP verification failed.')
        return
      }

      setResetToken(res.data.data.resetToken)
      setSuccess('OTP verified successfully. Set your new password.')
      setMode('resetPassword')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // RESET PASSWORD
  const handleResetPassword = async event => {
    event.preventDefault()
    resetMessages()

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('New Password and Confirm Password do not match.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(`${apiUrl}/user/password/reset`, {
        resetToken,
        newPassword
      })

      setSuccess(
        res.data?.message || 'Password reset successfully. Please login.'
      )

      setPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setOtp('')
      setResetToken('')
      setShowPassword(false)
      setShowNewPassword(false)
      setShowConfirmNewPassword(false)
      setMode('login')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to reset password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const heading = {
    login: 'Welcome Back!',
    register: 'Create Your Account',
    forgot: 'Forgot Password?',
    verifyOtp: 'Verify Your Email',
    resetPassword: 'Create New Password'
  }

  const subHeading = {
    login: 'Login to continue shopping with us.',
    register: 'Join G.K.P BookStore today.',
    forgot: 'Enter your registered email to receive an OTP.',
    verifyOtp: 'Enter the 6-digit OTP sent to your email.',
    resetPassword: 'Choose a strong password for your account.'
  }

  const primaryButtonStyle = {
    backgroundColor: '#142D4E',
    borderColor: '#142D4E',
    padding: '11px',
    fontWeight: '600',
    borderRadius: '9px'
  }

  const inputStyle = {
    borderRadius: '9px',
    padding: '11px 12px'
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop='static'
      keyboard={!loading}
      size='md'
    >
      <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
        {/* HEADER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #142D4E, #24527D)',
            color: '#fff',
            padding: '25px 24px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              margin: '0 auto 12px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '25px'
            }}
          >
            <i className='bi bi-book-half'></i>
          </div>

          <h4 className='fw-bold mb-1'>G.K.P BookStore</h4>

          <h5 className='fw-semibold mt-3 mb-1'>{heading[mode]}</h5>

          <p className='mb-0 small' style={{ opacity: 0.85 }}>
            {subHeading[mode]}
          </p>
        </div>

        <Modal.Body style={{ padding: '25px 28px', background: '#fff' }}>
          {error && (
            <Alert
              variant='danger'
              dismissible
              onClose={() => setError('')}
              className='small'
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant='success' className='small'>
              {success}
            </Alert>
          )}

          {/* LOGIN */}
          {mode === 'login' && (
            <Form onSubmit={doLogin}>
              <Form.Group className='mb-3'>
                <Form.Label className='fw-semibold'>Email Address</Form.Label>

                <InputGroup>
                  <InputGroup.Text>
                    <i className='bi bi-envelope'></i>
                  </InputGroup.Text>

                  <Form.Control
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    autoComplete='email'
                    style={inputStyle}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label className='fw-semibold'>Password</Form.Label>

                <InputGroup>
                  <InputGroup.Text>
                    <i className='bi bi-lock'></i>
                  </InputGroup.Text>

                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    autoComplete='current-password'
                    style={inputStyle}
                    required
                  />

                  <Button
                    variant='outline-secondary'
                    onClick={() => setShowPassword(!showPassword)}
                    type='button'
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

              <div className='text-end mb-4'>
                <Button
                  variant='link'
                  className='p-0 text-decoration-none fw-semibold'
                  style={{ color: '#24527D', fontSize: '14px' }}
                  onClick={() => switchMode('forgot')}
                  disabled={loading}
                >
                  Forgot Password?
                </Button>
              </div>

              <Button
                type='submit'
                className='w-100'
                style={primaryButtonStyle}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size='sm' className='me-2' />
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className='bi bi-box-arrow-in-right me-2'></i>
                    Login
                  </>
                )}
              </Button>

              <div className='text-center mt-4 small'>
                Don't have an account?{' '}
                <Button
                  variant='link'
                  className='p-0 text-decoration-none fw-bold'
                  style={{ color: '#24527D' }}
                  onClick={() => switchMode('register')}
                  disabled={loading}
                >
                  Register Now
                </Button>
              </div>
            </Form>
          )}

          {/* REGISTER */}
          {mode === 'register' && (
            <Form onSubmit={handleRegister}>
              <Form.Group className='mb-3'>
                <Form.Label className='fw-semibold'>First Name</Form.Label>
                <Form.Control
                  type='text'
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder='Enter first name'
                  autoComplete='given-name'
                  style={inputStyle}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label className='fw-semibold'>Last Name</Form.Label>
                <Form.Control
                  type='text'
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder='Enter last name'
                  autoComplete='family-name'
                  style={inputStyle}
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label className='fw-semibold'>Mobile Number</Form.Label>
                <Form.Control
                  type='tel'
                  value={mobileNo}
                  onChange={e =>
                    setMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder='Enter 10-digit mobile number'
                  autoComplete='tel'
                  maxLength={10}
                  style={inputStyle}
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label className='fw-semibold'>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  autoComplete='email'
                  style={inputStyle}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label className='fw-semibold'>Password</Form.Label>

                <InputGroup>
                  <InputGroup.Text>
                    <i className='bi bi-lock'></i>
                  </InputGroup.Text>

                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Create password'
                    autoComplete='new-password'
                    minLength={6}
                    style={inputStyle}
                    required
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

              <Form.Group className='mb-4'>
                <Form.Label className='fw-semibold'>
                  Confirm Password
                </Form.Label>

                <InputGroup>
                  <InputGroup.Text>
                    <i className='bi bi-lock-fill'></i>
                  </InputGroup.Text>

                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder='Confirm password'
                    autoComplete='new-password'
                    minLength={6}
                    style={inputStyle}
                    required
                  />

                  <Button
                    variant='outline-secondary'
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={
                      showConfirmPassword ? 'Hide Password' : 'Show Password'
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

              <Button
                type='submit'
                variant='success'
                className='w-100'
                style={{ ...primaryButtonStyle, backgroundColor: '#198754' }}
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

              <div className='text-center mt-4 small'>
                Already have an account?{' '}
                <Button
                  variant='link'
                  className='p-0 text-decoration-none fw-bold'
                  style={{ color: '#24527D' }}
                  onClick={() => switchMode('login')}
                  disabled={loading}
                >
                  Login
                </Button>
              </div>
            </Form>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <Form onSubmit={handleSendOtp}>
              <div
                className='text-center mb-4'
                style={{
                  background: '#f0f5fa',
                  padding: '18px',
                  borderRadius: '12px'
                }}
              >
                <i
                  className='bi bi-shield-lock'
                  style={{ fontSize: '35px', color: '#24527D' }}
                ></i>
                <p className='mb-0 mt-2 small text-muted'>
                  We'll send a secure 6-digit OTP to your registered email.
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
                  autoComplete='email'
                  style={inputStyle}
                  required
                />
              </Form.Group>

              <Button
                type='submit'
                className='w-100'
                style={primaryButtonStyle}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size='sm' className='me-2' />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <i className='bi bi-send me-2'></i>
                    Send OTP
                  </>
                )}
              </Button>

              <div className='text-center mt-4'>
                <Button
                  variant='link'
                  className='text-decoration-none fw-semibold'
                  style={{ color: '#24527D' }}
                  onClick={() => switchMode('login')}
                  disabled={loading}
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
                className='text-center mb-4'
                style={{
                  background: '#f0f5fa',
                  padding: '18px',
                  borderRadius: '12px'
                }}
              >
                <i
                  className='bi bi-envelope-check'
                  style={{ fontSize: '35px', color: '#24527D' }}
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
                  className='text-center fw-bold'
                  style={{
                    ...inputStyle,
                    fontSize: '23px',
                    letterSpacing: '9px'
                  }}
                  required
                />

                <Form.Text className='text-muted'>
                  OTP is valid for 5 minutes.
                </Form.Text>
              </Form.Group>

              <Button
                type='submit'
                className='w-100'
                style={primaryButtonStyle}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Spinner size='sm' className='me-2' />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <div className='text-center mt-3'>
                <Button
                  variant='link'
                  className='text-decoration-none fw-semibold'
                  style={{ color: '#24527D' }}
                  onClick={() => switchMode('forgot')}
                  disabled={loading}
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
                className='text-center mb-4'
                style={{
                  background: '#eef8f1',
                  padding: '18px',
                  borderRadius: '12px'
                }}
              >
                <i
                  className='bi bi-shield-check'
                  style={{ fontSize: '35px', color: '#198754' }}
                ></i>
                <p className='small text-success mt-2 mb-0'>
                  Email verified successfully.
                </p>
              </div>

              <Form.Group className='mb-3'>
                <Form.Label className='fw-semibold'>New Password</Form.Label>

                <InputGroup>
                  <InputGroup.Text>
                    <i className='bi bi-lock'></i>
                  </InputGroup.Text>

                  <Form.Control
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder='Enter new password'
                    autoComplete='new-password'
                    minLength={8}
                    style={inputStyle}
                    required
                  />

                  <Button
                    variant='outline-secondary'
                    type='button'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title={showNewPassword ? 'Hide Password' : 'Show Password'}
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
                  <InputGroup.Text>
                    <i className='bi bi-lock-fill'></i>
                  </InputGroup.Text>

                  <Form.Control
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    placeholder='Confirm new password'
                    autoComplete='new-password'
                    minLength={8}
                    style={inputStyle}
                    required
                  />

                  <Button
                    variant='outline-secondary'
                    type='button'
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    title={
                      showConfirmNewPassword ? 'Hide Password' : 'Show Password'
                    }
                  >
                    <i
                      className={`bi ${
                        showConfirmNewPassword ? 'bi-eye-slash' : 'bi-eye'
                      }`}
                    ></i>
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                type='submit'
                className='w-100'
                style={primaryButtonStyle}
                disabled={loading}
              >
                {loading ? (
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
            </Form>
          )}

          <div
            className='text-center mt-4 pt-3'
            style={{ borderTop: '1px solid #eee' }}
          >
            <small className='text-muted'>
              <i className='bi bi-shield-check me-1'></i>
              Secure Shopping with G.K.P BookStore
            </small>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default Login
