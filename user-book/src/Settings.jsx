import { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { clearUserSession } from './utils/userSession.js'

const sections = [
  { id: 'account', title: 'Account Settings', icon: 'bi-person-gear' },
  { id: 'notifications', title: 'Notifications', icon: 'bi-bell' },
  { id: 'security', title: 'Privacy & Security', icon: 'bi-shield-lock' },
  { id: 'preferences', title: 'App Preferences', icon: 'bi-sliders' }
]

function Settings () {
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('account')
  const [message, setMessage] = useState('')

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    paymentNotifications: true,
    promotionalEmails: false
  })

  const [preferences, setPreferences] = useState({
    language: localStorage.getItem('appLanguage') || 'English',
    currency: localStorage.getItem('appCurrency') || 'INR',
    theme: localStorage.getItem('appTheme') || 'Light'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')

  const updateNotification = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updatePreference = (key, value) => {
    const updated = {
      ...preferences,
      [key]: value
    }

    setPreferences(updated)

    if (key === 'language') {
      localStorage.setItem('appLanguage', value)
    }

    if (key === 'currency') {
      localStorage.setItem('appCurrency', value)
    }

    if (key === 'theme') {
      localStorage.setItem('appTheme', value)
    }
  }

  const handlePasswordSubmit = e => {
    e.preventDefault()

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setMessage('Please fill all password fields.')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New password and confirm password do not match.')
      return
    }

    setMessage('Password API integration will be added in the next step.')
  }

  const handleEmailSubmit = e => {
    e.preventDefault()

    if (!email.trim()) {
      setMessage('Please enter your new email address.')
      return
    }

    setMessage('Email OTP verification will be connected in the next step.')
  }

  const handleMobileSubmit = e => {
    e.preventDefault()

    if (!mobile.trim()) {
      setMessage('Please enter your mobile number.')
      return
    }

    setMessage('Mobile number update API will be connected in the next step.')
  }

  const handleLogout = () => {
    clearUserSession()
    navigate('/')
    window.location.reload()
  }

  const inputStyle = {
    borderRadius: '10px',
    padding: '11px 13px',
    border: '1px solid #DDE5EB'
  }

  const cardStyle = {
    border: '1px solid #E8EDF1',
    borderRadius: '15px',
    boxShadow: '0 4px 18px rgba(20,45,78,0.04)',
    marginBottom: '20px'
  }

  const headingStyle = {
    color: '#142D4E',
    fontWeight: '700',
    fontSize: '18px'
  }

  const primaryButton = {
    background: '#0F766E',
    border: 'none',
    borderRadius: '9px',
    padding: '10px 22px',
    fontWeight: '600'
  }

  const renderAccount = () => (
    <>
      <Card style={cardStyle}>
        <Card.Body className='p-4'>
          <h5 style={headingStyle}>
            <i className='bi bi-key me-2' />
            Change Password
          </h5>
          <p className='text-muted small'>
            Update your password to keep your account secure.
          </p>

          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type='password'
                style={inputStyle}
                value={passwordData.currentPassword}
                onChange={e =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })
                }
                placeholder='Enter current password'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type='password'
                style={inputStyle}
                value={passwordData.newPassword}
                onChange={e =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })
                }
                placeholder='Enter new password'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type='password'
                style={inputStyle}
                value={passwordData.confirmPassword}
                onChange={e =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })
                }
                placeholder='Confirm new password'
              />
            </Form.Group>

            <Button type='submit' style={primaryButton}>
              Update Password
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card style={cardStyle}>
        <Card.Body className='p-4'>
          <h5 style={headingStyle}>
            <i className='bi bi-envelope me-2' />
            Update Email Address
          </h5>
          <p className='text-muted small'>
            Change your registered email after OTP verification.
          </p>

          <Form onSubmit={handleEmailSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>New Email Address</Form.Label>
              <Form.Control
                type='email'
                style={inputStyle}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Enter new email'
              />
            </Form.Group>

            <Button type='submit' style={primaryButton}>
              Continue with Email Verification
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card style={cardStyle}>
        <Card.Body className='p-4'>
          <h5 style={headingStyle}>
            <i className='bi bi-phone me-2' />
            Change Mobile Number
          </h5>
          <p className='text-muted small'>
            Update your registered contact number.
          </p>

          <Form onSubmit={handleMobileSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>New Mobile Number</Form.Label>
              <Form.Control
                type='tel'
                maxLength={10}
                style={inputStyle}
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder='Enter 10 digit mobile number'
              />
            </Form.Group>

            <Button type='submit' style={primaryButton}>
              Update Mobile Number
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )

  const renderNotifications = () => (
    <Card style={cardStyle}>
      <Card.Body className='p-4'>
        <h5 style={headingStyle}>Notification Preferences</h5>
        <p className='text-muted small'>
          Choose which notifications you want to receive.
        </p>

        {[
          {
            key: 'orderUpdates',
            title: 'Order Updates',
            description: 'Receive updates about your book orders.'
          },
          {
            key: 'paymentNotifications',
            title: 'Payment Notifications',
            description: 'Get payment confirmation and transaction alerts.'
          },
          {
            key: 'promotionalEmails',
            title: 'Promotional Emails',
            description: 'Receive offers, discounts and new book updates.'
          }
        ].map(item => (
          <div
            key={item.key}
            className='d-flex justify-content-between align-items-center py-3 border-bottom gap-3'
          >
            <div>
              <div className='fw-semibold'>{item.title}</div>
              <small className='text-muted'>{item.description}</small>
            </div>

            <Form.Check
              type='switch'
              checked={notifications[item.key]}
              onChange={e => updateNotification(item.key, e.target.checked)}
            />
          </div>
        ))}

        <Button
          className='mt-4'
          style={primaryButton}
          onClick={() =>
            setMessage(
              'Notification preferences will be saved to your account in the next step.'
            )
          }
        >
          Save Notification Settings
        </Button>
      </Card.Body>
    </Card>
  )

  const renderSecurity = () => (
    <>
      <Card style={cardStyle}>
        <Card.Body className='p-4'>
          <h5 style={headingStyle}>
            <i className='bi bi-shield-check me-2' />
            Account Security
          </h5>

          <div className='d-flex justify-content-between align-items-center py-3 border-bottom gap-3'>
            <div>
              <div className='fw-semibold'>Current Login</div>
              <small className='text-muted'>
                You are currently logged in on this browser.
              </small>
            </div>
            <Badge bg='success'>Active</Badge>
          </div>

          <div className='py-3'>
            <div className='fw-semibold'>Logout from this device</div>
            <small className='text-muted'>
              End your current login session securely.
            </small>
            <div>
              <Button
                variant='outline-danger'
                className='mt-3'
                onClick={handleLogout}
              >
                <i className='bi bi-box-arrow-right me-2' />
                Logout
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card style={cardStyle}>
        <Card.Body className='p-4'>
          <h5 className='text-danger fw-bold'>
            <i className='bi bi-exclamation-triangle me-2' />
            Delete Account
          </h5>
          <p className='text-muted small'>
            Account deletion is a sensitive action. We will add a secure request
            and confirmation process before enabling it.
          </p>
          <Button
            variant='outline-danger'
            onClick={() =>
              setMessage(
                'Secure account deletion request will be implemented in a later step.'
              )
            }
          >
            Request Account Deletion
          </Button>
        </Card.Body>
      </Card>
    </>
  )

  const renderPreferences = () => (
    <Card style={cardStyle}>
      <Card.Body className='p-4'>
        <h5 style={headingStyle}>Application Preferences</h5>
        <p className='text-muted small'>Customize your BookStore experience.</p>

        <Form.Group className='mb-4'>
          <Form.Label className='fw-semibold'>Language</Form.Label>
          <Form.Select
            style={inputStyle}
            value={preferences.language}
            onChange={e => updatePreference('language', e.target.value)}
          >
            <option value='English'>English</option>
            <option value='Hindi'>Hindi</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className='mb-4'>
          <Form.Label className='fw-semibold'>Currency</Form.Label>
          <Form.Select
            style={inputStyle}
            value={preferences.currency}
            onChange={e => updatePreference('currency', e.target.value)}
          >
            <option value='INR'>INR (₹)</option>
            <option value='USD'>USD ($)</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label className='fw-semibold'>Theme</Form.Label>
          <Form.Select
            style={inputStyle}
            value={preferences.theme}
            onChange={e => updatePreference('theme', e.target.value)}
          >
            <option value='Light'>Light</option>
            <option value='Dark'>Dark</option>
          </Form.Select>
        </Form.Group>

        <Alert variant='info' className='small mb-0'>
          Preferences are currently saved in this browser. We will connect them
          to your user account in the backend integration step.
        </Alert>
      </Card.Body>
    </Card>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccount()
      case 'notifications':
        return renderNotifications()
      case 'security':
        return renderSecurity()
      case 'preferences':
        return renderPreferences()
      default:
        return renderAccount()
    }
  }

  const activeTitle = sections.find(
    section => section.id === activeSection
  )?.title

  return (
    <div
      style={{
        background: '#F5F7FA',
        minHeight: '100vh',
        padding: '35px 0 60px'
      }}
    >
      <Container>
        <div className='mb-4'>
          <h3 style={{ color: '#142D4E', fontWeight: '800' }}>
            Account Settings
          </h3>
          <p className='text-muted mb-0'>
            Manage your account, security and BookStore preferences.
          </p>
        </div>

        {message && (
          <Alert variant='info' dismissible onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        <Row className='g-4'>
          <Col lg={3}>
            <Card style={{ ...cardStyle, position: 'sticky', top: '20px' }}>
              <Card.Body className='p-3'>
                <div
                  className='fw-bold px-2 py-2 mb-2'
                  style={{ color: '#142D4E' }}
                >
                  SETTINGS MENU
                </div>

                {sections.map(section => (
                  <Button
                    key={section.id}
                    variant='light'
                    className='w-100 text-start mb-2'
                    onClick={() => {
                      setActiveSection(section.id)
                      setMessage('')
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background:
                        activeSection === section.id
                          ? '#E5F3F1'
                          : 'transparent',
                      color:
                        activeSection === section.id ? '#0F766E' : '#526174',
                      fontWeight: activeSection === section.id ? '700' : '500'
                    }}
                  >
                    <i className={`${section.icon} me-2`} />
                    {section.title}
                    {activeSection === section.id && (
                      <i className='bi bi-chevron-right float-end mt-1' />
                    )}
                  </Button>
                ))}

                <hr />

                <Button
                  variant='outline-secondary'
                  className='w-100'
                  onClick={() => navigate('/profile')}
                >
                  <i className='bi bi-person-circle me-2' />
                  My Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <div className='mb-3'>
              <h5 style={{ color: '#142D4E', fontWeight: '700' }}>
                {activeTitle}
              </h5>
            </div>

            {renderContent()}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Settings
