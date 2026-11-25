import { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Accordion
} from 'react-bootstrap'

function Contact () {
  const apiUrl = import.meta.env.VITE_API_URL

  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    mobile: '',
    subject: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({
    type: '',
    message: ''
  })

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setAlert({ type: '', message: '' })

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject ||
      !formData.message.trim()
    ) {
      setAlert({
        type: 'danger',
        message: 'Please fill all required fields.'
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Unable to submit your request.')
      }

      setAlert({
        type: 'success',
        message:
          result.message || 'Your message has been submitted successfully!'
      })

      setFormData({
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        mobile: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.message || 'Something went wrong. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const contactCards = [
    {
      icon: 'bi-envelope-at',
      title: 'Email Us',
      value: 'Support Email',
      description: 'For general queries and support',
      color: '#E8F3FF'
    },
    {
      icon: 'bi-telephone',
      title: 'Call Us',
      value: 'Customer Support',
      description: 'For assistance with your orders',
      color: '#E8F7F3'
    },
    {
      icon: 'bi-geo-alt',
      title: 'Our Location',
      value: 'G.K.P BookStore',
      description: 'Online BookStore',
      color: '#FFF5E8'
    }
  ]

  const faqs = [
    {
      question: 'How can I track my order?',
      answer:
        'Login to your account and visit the My Orders section to check your order details and status.'
    },
    {
      question: 'How can I make a payment?',
      answer:
        'You can complete your payment securely through the available payment options at checkout.'
    },
    {
      question: 'What should I do if my payment fails?',
      answer:
        'Please check your payment status in My Orders. If the amount was deducted but your order was not confirmed, contact our support team.'
    },
    {
      question: 'How can I update my profile?',
      answer:
        'Login to your account and open My Profile to update your personal information.'
    }
  ]

  const inputStyle = {
    borderRadius: '9px',
    padding: '10px 12px',
    border: '1px solid #DCE4EA',
    fontSize: '14px'
  }

  const cardStyle = {
    borderRadius: '13px',
    boxShadow: '0 4px 16px rgba(20,45,78,0.05)',
    border: '1px solid #E8EDF1'
  }

  return (
    <div
      style={{
        background: '#F5F7FA',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {/* Compact Hero Section */}
      <Container
        fluid={false}
        style={{
          maxWidth: '1140px',
          paddingLeft: '12px',
          paddingRight: '12px',
          marginTop: '20px'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(120deg, #142D4E, #0F766E)',
            padding: '30px 15px',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '12px'
          }}
        >
          <div
            className='mx-auto mb-2 d-flex align-items-center justify-content-center'
            style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '13px'
            }}
          >
            <i className='bi bi-headset' style={{ fontSize: '24px' }} />
          </div>

          <h2 className='fw-bold mb-1'>Contact Us</h2>

          <p className='mb-0 small' style={{ color: '#E2F2F1' }}>
            We're here to help you with your BookStore experience.
          </p>
        </div>
      </Container>

      <Container
        fluid={false}
        style={{
          maxWidth: '1140px',
          paddingTop: '30px',
          paddingBottom: '40px'
        }}
      >
        {/* Contact Information Cards */}
        <Row className='g-3 mb-4'>
          {contactCards.map((item, index) => (
            <Col md={4} key={index}>
              <Card className='h-100 text-center border-0' style={cardStyle}>
                <Card.Body className='p-3'>
                  <div
                    className='mx-auto mb-2 d-flex align-items-center justify-content-center'
                    style={{
                      width: '45px',
                      height: '45px',
                      background: item.color,
                      color: '#0F766E',
                      borderRadius: '12px'
                    }}
                  >
                    <i
                      className={`bi ${item.icon}`}
                      style={{ fontSize: '21px' }}
                    />
                  </div>

                  <h6 className='fw-bold mb-1' style={{ color: '#142D4E' }}>
                    {item.title}
                  </h6>

                  <div
                    className='fw-semibold small mb-1'
                    style={{ color: '#0F766E' }}
                  >
                    {item.value}
                  </div>

                  <p className='text-muted small mb-0'>{item.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Contact Form and Details */}
        <Row className='g-3'>
          <Col lg={7}>
            <Card className='h-100 border-0' style={cardStyle}>
              <Card.Body className='p-3 p-md-4'>
                <h5 className='fw-bold mb-1' style={{ color: '#142D4E' }}>
                  Send Us a Message
                </h5>

                <p className='text-muted small mb-3'>
                  Fill out the form and our team will get back to you.
                </p>

                {alert.message && (
                  <Alert
                    variant={alert.type}
                    dismissible
                    onClose={() => setAlert({ type: '', message: '' })}
                  >
                    {alert.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label className='fw-semibold small'>
                          Full Name *
                        </Form.Label>
                        <Form.Control
                          name='name'
                          value={formData.name}
                          onChange={handleChange}
                          placeholder='Enter your name'
                          style={inputStyle}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label className='fw-semibold small'>
                          Email Address *
                        </Form.Label>
                        <Form.Control
                          type='email'
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                          placeholder='Enter your email'
                          style={inputStyle}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className='mb-3'>
                    <Form.Label className='fw-semibold small'>
                      Mobile Number
                    </Form.Label>
                    <Form.Control
                      type='tel'
                      name='mobile'
                      maxLength={10}
                      value={formData.mobile}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          mobile: e.target.value.replace(/\D/g, '')
                        })
                      }
                      placeholder='Enter mobile number'
                      style={inputStyle}
                    />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label className='fw-semibold small'>
                      Subject *
                    </Form.Label>
                    <Form.Select
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                    >
                      <option value=''>Select your subject</option>
                      <option value='Order Related'>Order Related</option>
                      <option value='Payment Issue'>Payment Issue</option>
                      <option value='Delivery Issue'>Delivery Issue</option>
                      <option value='Book Related'>Book Related</option>
                      <option value='Account Issue'>Account Issue</option>
                      <option value='Other'>Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label className='fw-semibold small'>
                      Your Message *
                    </Form.Label>
                    <Form.Control
                      as='textarea'
                      rows={4}
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      placeholder='Write your message here...'
                      style={{ ...inputStyle, resize: 'vertical' }}
                      required
                    />
                  </Form.Group>

                  <Button
                    type='submit'
                    disabled={loading}
                    className='w-100'
                    style={{
                      background: '#0F766E',
                      border: 'none',
                      borderRadius: '9px',
                      padding: '11px',
                      fontWeight: '600'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className='spinner-border spinner-border-sm me-2' />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <i className='bi bi-send me-2' />
                        Send Message
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Details */}
          <Col lg={5}>
            <Card className='border-0 mb-3' style={cardStyle}>
              <Card.Body className='p-3 p-md-4'>
                <h5 className='fw-bold mb-3' style={{ color: '#142D4E' }}>
                  Get in Touch
                </h5>

                <div className='d-flex gap-3 mb-3'>
                  <i
                    className='bi bi-envelope fs-5'
                    style={{ color: '#0F766E' }}
                  />
                  <div>
                    <div className='fw-semibold small'>Email Support</div>
                    <small className='text-muted'>
                      Add your official support email here
                    </small>
                  </div>
                </div>

                <div className='d-flex gap-3 mb-3'>
                  <i
                    className='bi bi-telephone fs-5'
                    style={{ color: '#0F766E' }}
                  />
                  <div>
                    <div className='fw-semibold small'>Phone Support</div>
                    <small className='text-muted'>
                      Add your official contact number here
                    </small>
                  </div>
                </div>

                <div className='d-flex gap-3 mb-3'>
                  <i
                    className='bi bi-clock fs-5'
                    style={{ color: '#0F766E' }}
                  />
                  <div>
                    <div className='fw-semibold small'>Working Hours</div>
                    <small className='text-muted'>
                      Monday - Saturday
                      <br />
                      10:00 AM - 6:00 PM
                    </small>
                  </div>
                </div>

                <hr />

                <h6 className='fw-bold' style={{ color: '#142D4E' }}>
                  Quick Assistance
                </h6>

                <p className='text-muted small mb-0'>
                  For order or payment-related queries, keep your order details
                  ready.
                </p>
              </Card.Body>
            </Card>

            {/* WhatsApp Support */}
            <Card
              className='border-0'
              style={{
                borderRadius: '13px',
                background: '#E8F7F3'
              }}
            >
              <Card.Body className='p-3'>
                <div className='d-flex gap-3 align-items-center'>
                  <i
                    className='bi bi-whatsapp'
                    style={{ fontSize: '30px', color: '#168B55' }}
                  />
                  <div>
                    <h6 className='fw-bold mb-1' style={{ color: '#142D4E' }}>
                      WhatsApp Support
                    </h6>
                    <small className='text-muted'>
                      Quick assistance through WhatsApp.
                    </small>
                  </div>
                </div>

                <p className='small text-muted mt-2 mb-0'>
                  Official WhatsApp contact details can be added here.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Section */}
        <div className='mt-4'>
          <div className='text-center mb-3'>
            <h5 className='fw-bold' style={{ color: '#142D4E' }}>
              Frequently Asked Questions
            </h5>
            <p className='text-muted small'>
              Quick answers to common questions.
            </p>
          </div>

          <Row className='justify-content-center'>
            <Col lg={10}>
              <Accordion flush>
                {faqs.map((faq, index) => (
                  <Accordion.Item
                    eventKey={String(index)}
                    key={index}
                    className='mb-2 border rounded-3 overflow-hidden'
                  >
                    <Accordion.Header>
                      <span
                        className='fw-semibold small'
                        style={{ color: '#142D4E' }}
                      >
                        {faq.question}
                      </span>
                    </Accordion.Header>

                    <Accordion.Body className='text-muted small'>
                      {faq.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default Contact
