import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Badge
} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  deleteCart,
  clearCartMessage,
  updateQuantity
} from './feactures/cart/cartSlice'

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

function getBookPrice(product) {
  const originalPrice = Number(
    product.originalPrice ?? product.price ?? 0
  )

  const discountValue = Number(product.discountValue || 0)

  const hasDiscount =
    product.status?.toLowerCase() === 'active' &&
    discountValue > 0

  if (!hasDiscount) return originalPrice

  if (product.discountType === 'Percentage') {
    return Math.max(
      0,
      originalPrice - (originalPrice * discountValue) / 100
    )
  }

  if (product.discountType === 'Fixed') {
    return Math.max(0, originalPrice - discountValue)
  }

  return originalPrice
}

function CheckOut() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { products } = useSelector(state => state.cart)

  const [shipping, setShipping] = useState(initialShippingDetails)
  const [authChecking, setAuthChecking] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const orderProducts = products.map(product => {
    const quantity = Math.max(1, Number(product.quantity || 1))
    const originalPrice = Number(
      product.originalPrice ?? product.price ?? 0
    )
    const finalPrice = getBookPrice(product)

    return {
      ...product,
      quantity,
      originalPrice,
      finalPrice,
      subtotal: finalPrice * quantity
    }
  })

  const totalOriginalPrice = orderProducts.reduce(
    (total, product) =>
      total + product.originalPrice * product.quantity,
    0
  )

  const totalCost = orderProducts.reduce(
    (total, product) => total + product.subtotal,
    0
  )

  const totalSavings = totalOriginalPrice - totalCost

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

  useEffect(() => {
    if (!authChecking && products.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [products.length, authChecking, navigate])

  const handleChange = e => {
    const { name, value } = e.target

    setShipping(previous => ({
      ...previous,
      [name]: value
    }))
  }

  const increaseQuantity = product => {
    dispatch(
      updateQuantity({
        id: product._id,
        quantity: Number(product.quantity || 1) + 1
      })
    )
  }

  const decreaseQuantity = product => {
    const currentQuantity = Number(product.quantity || 1)

    if (currentQuantity > 1) {
      dispatch(
        updateQuantity({
          id: product._id,
          quantity: currentQuantity - 1
        })
      )
    }
  }

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
        if (existingScript.dataset.loaded === 'true') {
          resolve(true)
          return
        }

        existingScript.addEventListener(
          'load',
          () => resolve(true),
          { once: true }
        )

        existingScript.addEventListener(
          'error',
          () => resolve(false),
          { once: true }
        )

        return
      }

      const script = document.createElement('script')

      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true

      script.onload = () => {
        script.dataset.loaded = 'true'
        resolve(true)
      }

      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })
  }

  const handlePayment = async e => {
    e.preventDefault()

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

    if (!Number.isFinite(totalCost) || totalCost <= 0) {
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
        amount: Number(totalCost.toFixed(2)),
        products: orderProducts.map(product => ({
          bookId: product._id,
          bookTitle:
            product.bookTittle ||
            product.bookTitle ||
            product.title ||
            'Book',
          bookImage: product.bookImage || '',
          quantity: product.quantity,
          originalPrice: product.originalPrice,
          discountValue: Number(product.discountValue || 0),
          discountType: product.discountType || '',
          discountStatus: product.status || '',
          finalPrice: product.finalPrice,
          subtotal: product.subtotal
        }))
      }

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
            const verifyResponse = await axios.post(
              `${apiUrl}/verify-payment`,
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,
                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,
                razorpay_signature:
                  paymentResponse.razorpay_signature
              }
            )

            if (verifyResponse.status !== 200) {
              throw new Error('Payment verification failed.')
            }

            dispatch(deleteCart())
            dispatch(clearCartMessage())

            setShipping(initialShippingDetails)
            setSuccess(
              'Payment successful! Redirecting to My Orders...'
            )
            setError('')
            setLoading(false)

            setTimeout(() => {
              navigate('/myorders', { replace: true })
            }, 1000)
          } catch (verificationError) {
            console.error(
              'Payment verification error:',
              verificationError
            )

            setError(
              verificationError.response?.data?.message ||
                'Payment was submitted, but verification could not be confirmed. Please check My Orders before retrying.'
            )

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
          response.error?.description ||
            'Payment failed. Please try again.'
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

  if (products.length === 0) {
    return (
      <Container className='text-center py-5'>
        <Spinner animation='border' />
        <p className='mt-2'>Redirecting to cart...</p>
      </Container>
    )
  }

  return (
    <Container className='py-4'>
      <h2 className='mb-4'>
        <i className='bi bi-credit-card me-2' />
        Checkout
      </h2>

      {error && (
        <Alert
          variant='danger'
          dismissible
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant='success'>{success}</Alert>
      )}

      <Row className='g-4'>
        <Col lg={8}>
          <Form id='checkout-form' onSubmit={handlePayment}>
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
                onChange={e => {
                  const value = e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 10)

                  setShipping(previous => ({
                    ...previous,
                    mobileNo: value
                  }))
                }}
                maxLength={10}
                inputMode='numeric'
                required
              />
            </Form.Group>

            <h5 className='mt-3 text-primary'>
              Shipping Address
            </h5>

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
                    onChange={e => {
                      const value = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6)

                      setShipping(previous => ({
                        ...previous,
                        pincode: value
                      }))
                    }}
                    maxLength={6}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col lg={4}>
          <div className='border rounded p-3 shadow-sm'>
            <h4 className='text-center text-danger'>
              Product Summary
            </h4>

            <div className='table-responsive'>
              <table className='table mt-3 align-middle'>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Book Details</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {orderProducts.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.bookImage}
                          alt={
                            product.bookTittle ||
                            product.bookTitle ||
                            'Book'
                          }
                          width='45'
                          height='55'
                          style={{ objectFit: 'contain' }}
                        />
                      </td>

                      <td>
                        <div className='fw-semibold'>
                          {product.bookTittle ||
                            product.bookTitle ||
                            product.title ||
                            'Book'}
                        </div>

                        <small className='text-muted d-block'>
                          ₹{product.finalPrice.toFixed(2)} ×{' '}
                          {product.quantity}
                        </small>

                        <div className='d-flex align-items-center gap-2 mt-2'>
                          <Button
                            type='button'
                            variant='outline-secondary'
                            size='sm'
                            disabled={
                              product.quantity <= 1 || loading
                            }
                            onClick={() =>
                              decreaseQuantity(product)
                            }
                          >
                            −
                          </Button>

                          <span className='fw-semibold'>
                            {product.quantity}
                          </span>

                          <Button
                            type='button'
                            variant='outline-primary'
                            size='sm'
                            disabled={loading}
                            onClick={() =>
                              increaseQuantity(product)
                            }
                          >
                            +
                          </Button>
                        </div>

                        {product.finalPrice <
                          product.originalPrice && (
                          <div className='mt-1'>
                            <Badge bg='success'>
                              {product.status?.toLowerCase() ===
                              'active'
                                ? product.discountType ===
                                  'Percentage'
                                  ? `${product.discountValue}% Off`
                                  : `₹${product.discountValue} Off`
                                : 'Discount'}
                            </Badge>
                          </div>
                        )}
                      </td>

                      <td className='fw-semibold'>
                        ₹{product.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr />

            <div className='d-flex justify-content-between mb-2'>
              <span className='text-muted'>
                Original Price
              </span>
              <span>
                ₹
                {totalOriginalPrice.toLocaleString('en-IN', {
                  maximumFractionDigits: 2
                })}
              </span>
            </div>

            <div className='d-flex justify-content-between mb-2'>
              <span className='text-success'>
                Total Savings
              </span>
              <span className='text-success fw-semibold'>
                - ₹
                {totalSavings.toLocaleString('en-IN', {
                  maximumFractionDigits: 2
                })}
              </span>
            </div>

            <hr />

            <div className='d-flex justify-content-between align-items-center'>
              <strong className='fs-5'>
                Total Amount
              </strong>

              <strong className='fs-5 text-success'>
                ₹
                {totalCost.toLocaleString('en-IN', {
                  maximumFractionDigits: 2
                })}
              </strong>
            </div>

            <Button
              type='submit'
              form='checkout-form'
              variant='warning'
              size='lg'
              className='w-100 fw-semibold mt-4'
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
                <>
                  Pay Now ₹
                  {totalCost.toLocaleString('en-IN', {
                    maximumFractionDigits: 2
                  })}
                  <i className='bi bi-arrow-right ms-2' />
                </>
              )}
            </Button>

            <div className='text-center text-muted small mt-3'>
              <i className='bi bi-shield-lock-fill me-1 text-success' />
              Secure payment powered by Razorpay
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default CheckOut
