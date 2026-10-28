import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteCart, clearCartMessage } from './feactures/cart/cartSlice'

const apiUrl = import.meta.env.VITE_API_URL
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID

const initialShippingDetails = {
  firstName: '',
  lastName: '',
  email: '',
  mobileNo: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: 'India',
  pincode: ''
}

function CheckOut () {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { products, totalCost } = useSelector(state => state.cart)

  const [shipping, setShipping] = useState(initialShippingDetails)
  const [authChecking, setAuthChecking] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Check login before showing checkout
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const email = localStorage.getItem('email')

    if (!isLoggedIn || !email) {
      sessionStorage.setItem('openLoginModal', 'true')
      sessionStorage.setItem('openCheckoutAfterLogin', 'true')

      navigate('/', { replace: true })
      return
    }

    setShipping(previous => ({
      ...previous,
      email: email.trim()
    }))

    setAuthChecking(false)
  }, [navigate])

  const handleChange = e => {
    const { name, value } = e.target

    setShipping(previous => ({
      ...previous,
      [name]: value
    }))
  }

  // Load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise(resolve => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true), {
          once: true
        })
        existingScript.addEventListener('error', () => resolve(false), {
          once: true
        })
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })
  }

  const handlePayment = async e => {
    e?.preventDefault()
    setError('')
    setSuccess('')

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const savedEmail = localStorage.getItem('email')

    if (!isLoggedIn || !savedEmail) {
      sessionStorage.setItem('openLoginModal', 'true')
      sessionStorage.setItem('openCheckoutAfterLogin', 'true')
      navigate('/', { replace: true })
      return
    }

    if (!products || products.length === 0) {
      setError('Your cart is empty.')
      return
    }

    if (!apiUrl) {
      setError('API URL missing. Check VITE_API_URL in your .env file.')
      return
    }

    if (!razorpayKey) {
      setError('Razorpay key missing. Check VITE_RAZORPAY_KEY_ID.')
      return
    }

    if (
      !shipping.firstName.trim() ||
      !shipping.lastName.trim() ||
      !shipping.mobileNo.trim() ||
      !shipping.addressLine1.trim() ||
      !shipping.city.trim() ||
      !shipping.state.trim() ||
      !shipping.country.trim() ||
      !shipping.pincode.trim()
    ) {
      setError('Please fill in all required shipping details.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(savedEmail.trim())) {
      setError('Please check your account email address.')
      return
    }

    if (!/^\d{10}$/.test(shipping.mobileNo)) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (!/^\d{6}$/.test(shipping.pincode)) {
      setError('Please enter a valid 6-digit PIN code.')
      return
    }

    if (!Number.isFinite(Number(totalCost)) || Number(totalCost) <= 0) {
      setError('The total amount must be greater than zero.')
      return
    }

    setLoading(true)

    try {
      const scriptLoaded = await loadRazorpayScript()

      if (!scriptLoaded) {
        throw new Error('Unable to load Razorpay. Please try again.')
      }

      const orderPayload = {
        ...shipping,
        email: savedEmail.trim().toLowerCase(),
        amount: Number(totalCost),
        products: products.map(product => ({
          bookId: product._id,
          bookTitle:
            product.bookTittle || product.bookTitle || product.title || 'Book',
          bookImage: product.bookImage || '',
          originalPrice: Number(product.originalPrice ?? product.price ?? 0)
        }))
      }

      // Create Razorpay order in backend
      const orderResponse = await axios.post(
        `${apiUrl}/create-order`,
        orderPayload
      )

      const razorpayOrder = orderResponse.data

      if (!razorpayOrder?.id) {
        throw new Error('Backend did not return a valid Razorpay order.')
      }

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'G.K.P. Book Store',
        description: 'Payment for Books',
        order_id: razorpayOrder.id,

        prefill: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          email: savedEmail.trim(),
          contact: shipping.mobileNo
        },

        notes: {
          address: shipping.addressLine1
        },

        theme: {
          color: '#142D4E'
        },

        handler: async paymentResponse => {
          try {
            // Verify payment with backend
            const verifyResponse = await axios.post(
              `${apiUrl}/verify-payment`,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature
              }
            )

            if (verifyResponse.status !== 200) {
              throw new Error('Payment verification failed.')
            }

            // Clear cart only after backend confirms payment
            dispatch(deleteCart())
            dispatch(clearCartMessage())

            setShipping(initialShippingDetails)
            setSuccess('Payment successful! Redirecting to My Orders...')
            setError('')

            setTimeout(() => {
              navigate('/myorders', { replace: true })
            }, 1000)
          } catch (verificationError) {
            console.error('Payment verification error:', verificationError)

            setError(
              verificationError.response?.data?.message ||
                'Payment was submitted, but verification could not be confirmed. Please check My Orders before retrying.'
            )
          } finally {
            setLoading(false)
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on('payment.failed', response => {
        console.error('Razorpay payment failed:', response.error)

        setError(
          response.error?.description || 'Payment failed. Please try again.'
        )

        setLoading(false)
      })

      razorpay.open()
    } catch (err) {
      console.error('Checkout error:', err)

      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to start payment. Please try again.'
      )

      setLoading(false)
    }
  }

  if (authChecking) {
    return (
      <Container className='text-center py-5'>
        <Spinner animation='border' />
        <p className='mt-2'>Checking login...</p>
      </Container>
    )
  }

  return (
    <Container className='py-4'>
      <h2 className='mb-4'>
        <i className='bi bi-credit-card me-2'></i>
        Checkout
      </h2>

      {error && (
        <Alert variant='danger' dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && <Alert variant='success'>{success}</Alert>}

      <Row className='g-4'>
        {/* Shipping Details */}
        <Col lg={8}>
          <Form onSubmit={handlePayment}>
            <h5 className='mb-3'>Shipping Details</h5>

            <Row>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    name='firstName'
                    value={shipping.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    name='lastName'
                    value={shipping.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={shipping.email}
                readOnly
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type='tel'
                name='mobileNo'
                value={shipping.mobileNo}
                onChange={handleChange}
                maxLength={10}
                inputMode='numeric'
                required
              />
            </Form.Group>

            <h5 className='mt-3 text-primary'>Shipping Address</h5>

            <Form.Group className='mb-3'>
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                name='addressLine1'
                value={shipping.addressLine1}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                name='addressLine2'
                value={shipping.addressLine2}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    name='city'
                    value={shipping.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    name='state'
                    value={shipping.state}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    name='country'
                    value={shipping.country}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>PIN Code</Form.Label>
                  <Form.Control
                    type='text'
                    inputMode='numeric'
                    name='pincode'
                    value={shipping.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>

        {/* Product Summary */}
        <Col lg={4}>
          <div className='border rounded p-3 shadow-sm'>
            <h4 className='text-center text-danger'>Product Summary</h4>

            {products.length === 0 ? (
              <Alert variant='info' className='mt-3'>
                Your cart is empty.
              </Alert>
            ) : (
              <div className='table-responsive'>
                <table className='table mt-3 align-middle'>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Book Name</th>
                      <th>Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={product.bookImage}
                            alt={
                              product.bookTittle || product.bookTitle || 'Book'
                            }
                            width='40'
                            height='50'
                            style={{ objectFit: 'cover' }}
                          />
                        </td>

                        <td>
                          {product.bookTittle ||
                            product.bookTitle ||
                            product.title ||
                            'Book'}
                        </td>

                        <td>
                          ₹
                          {Number(
                            product.originalPrice ?? product.price ?? 0
                          ).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan={2}>
                        <strong>Total Cost</strong>
                      </td>
                      <td>
                        <strong>
                          ₹{Number(totalCost || 0).toLocaleString('en-IN')}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className='d-flex justify-content-center mt-2'>
                  <Button
                    type='submit'
                    variant='warning'
                    size='lg'
                    className='mt-2'
                    onClick={() => handlePayment()}
                    disabled={loading || products.length === 0}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation='border'
                          size='sm'
                          className='me-2'
                        />
                        Processing...
                      </>
                    ) : (
                      `Pay Now ₹${Number(totalCost || 0).toLocaleString(
                        'en-IN'
                      )}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default CheckOut
