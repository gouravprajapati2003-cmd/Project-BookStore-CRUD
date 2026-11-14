import { useState } from 'react'
import { Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

function CreateAdmin () {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({
    type: '',
    text: ''
  })

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (formData.password.length < 8) {
      setMessage({
        type: 'danger',
        text: 'Password must contain at least 8 characters.'
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: 'danger',
        text: 'Password and Confirm Password do not match.'
      })
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      setMessage({
        type: 'danger',
        text: 'Authentication token not found. Please login again.'
      })
      return
    }

    try {
      setLoading(true)

      const backendUrl = `${apiUrl.replace(/\/+$/, '')}/admin/create`

      const res = await axios.post(
        backendUrl,
        {
          firstName: formData.firstName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.data.success) {
        setMessage({
          type: 'success',
          text: res.data.message || 'Admin created successfully!'
        })

        setFormData({
          firstName: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text:
          err.response?.data?.message ||
          'Unable to create admin. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='container-fluid py-4 px-3 px-md-4'
      style={{ minHeight: '85vh' }}
    >
      {/* Header */}
      <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4'>
        <div>
          <h3 className='fw-bold mb-1' style={{ color: '#142d4e' }}>
            Create New Admin
          </h3>
          <p className='text-secondary mb-0'>
            Add and manage administrator accounts for your BookStore.
          </p>
        </div>

        <Button
          variant='outline-secondary'
          onClick={() => navigate('/admins')}
          className='fw-semibold px-3 py-2'
          style={{ borderRadius: '9px' }}
        >
          <i className='bi bi-arrow-left me-2'></i>
          Back to Admin List
        </Button>
      </div>

      {/* Center Form */}
      <div className='d-flex justify-content-center align-items-center py-3'>
        <Card
          className='border-0 shadow-sm w-100'
          style={{
            maxWidth: '760px',
            borderRadius: '18px',
            overflow: 'hidden'
          }}
        >
          {/* Card Header */}
          <div
            className='p-4 text-white'
            style={{
              background: 'linear-gradient(135deg, #142d4e, #087f8c)'
            }}
          >
            <div className='d-flex align-items-center gap-3'>
              <div
                className='d-flex justify-content-center align-items-center rounded-3'
                style={{
                  width: '52px',
                  height: '52px',
                  background: 'rgba(255,255,255,0.16)',
                  fontSize: '24px'
                }}
              >
                <i className='bi bi-shield-lock-fill'></i>
              </div>

              <div>
                <h5 className='fw-bold mb-1'>Admin Information</h5>
                <p className='mb-0 small' style={{ opacity: 0.85 }}>
                  Enter the details to create a new administrator.
                </p>
              </div>
            </div>
          </div>

          <Card.Body className='p-4 p-md-5'>
            {message.text && (
              <Alert
                variant={message.type}
                dismissible
                onClose={() => setMessage({ type: '', text: '' })}
              >
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Name */}
              <Form.Group className='mb-4'>
                <Form.Label
                  className='fw-semibold'
                  style={{ color: '#26364a' }}
                >
                  <i className='bi bi-person me-2 text-secondary'></i>
                  Admin Full Name
                </Form.Label>

                <Form.Control
                  type='text'
                  name='firstName'
                  placeholder='Enter admin full name'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  maxLength={60}
                  style={{
                    borderRadius: '9px',
                    padding: '12px'
                  }}
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className='mb-4'>
                <Form.Label
                  className='fw-semibold'
                  style={{ color: '#26364a' }}
                >
                  <i className='bi bi-envelope me-2 text-secondary'></i>
                  Email Address
                </Form.Label>

                <Form.Control
                  type='email'
                  name='email'
                  placeholder='admin@example.com'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: '9px',
                    padding: '12px'
                  }}
                />
              </Form.Group>

              {/* Password */}
              <Row>
                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label
                      className='fw-semibold'
                      style={{ color: '#26364a' }}
                    >
                      <i className='bi bi-lock me-2 text-secondary'></i>
                      Password
                    </Form.Label>

                    <Form.Control
                      type='password'
                      name='password'
                      placeholder='Minimum 8 characters'
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      autoComplete='new-password'
                      style={{
                        borderRadius: '9px',
                        padding: '12px'
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label
                      className='fw-semibold'
                      style={{ color: '#26364a' }}
                    >
                      <i className='bi bi-shield-check me-2 text-secondary'></i>
                      Confirm Password
                    </Form.Label>

                    <Form.Control
                      type='password'
                      name='confirmPassword'
                      placeholder='Re-enter password'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete='new-password'
                      style={{
                        borderRadius: '9px',
                        padding: '12px'
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Info */}
              <div
                className='p-3 rounded-3 mb-4 d-flex align-items-start gap-2'
                style={{
                  background: '#f0fdfa',
                  border: '1px solid #ccfbf1'
                }}
              >
                <i className='bi bi-info-circle-fill text-success mt-1'></i>
                <small className='text-secondary'>
                  New admin accounts will be created with the Admin role and
                  Active status by default.
                </small>
              </div>

              {/* Buttons */}
              <div className='d-flex flex-wrap justify-content-end gap-2'>
                <Button
                  type='button'
                  variant='light'
                  className='px-4 py-2 fw-semibold'
                  onClick={() => navigate('/admins')}
                  style={{ borderRadius: '9px' }}
                >
                  Cancel
                </Button>

                <Button
                  type='submit'
                  disabled={loading}
                  className='px-4 py-2 fw-semibold border-0'
                  style={{
                    background: 'linear-gradient(135deg,#087f8c,#16b6a4)',
                    borderRadius: '9px'
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner size='sm' className='me-2' />
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className='bi bi-person-plus-fill me-2'></i>
                      Create Admin
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default CreateAdmin
