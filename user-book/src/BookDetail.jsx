import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, clearCartMessage } from './feactures/cart/cartSlice'
import axios from 'axios'
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

function BookDetail () {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()

  const [book, setBook] = useState({})
  const cartMessage = useSelector(state => state.cart.message)

  const [pincode, setPincode] = useState('')
  const [pincodeMsg, setPincodeMsg] = useState('')
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [pincodeAvailable, setPincodeAvailable] = useState(null)

  useEffect(() => {
    axios
      .get(`${apiUrl}/user/book/${id}`)
      .then(res => {
        setBook(res.data.data || {})
        dispatch(clearCartMessage())
      })
      .catch(err => console.log('Book fetch error:', err))
  }, [id, dispatch])

  const discountValue = Number(book.discountValue || 0)
  const originalPrice = Number(book.originalPrice || 0)

  const hasDiscount =
    book.status?.toLowerCase() === 'active' && discountValue > 0

  const finalPrice = hasDiscount
    ? book.discountType === 'Percentage'
      ? originalPrice - (originalPrice * discountValue) / 100
      : Math.max(0, originalPrice - discountValue)
    : originalPrice

  const totalSavings = originalPrice - finalPrice

  const addToCart = () => {
    if (!book._id) return
    dispatch(addProduct(book))
  }

  const buyNow = () => {
    if (!book._id) return
    dispatch(addProduct(book))
    navigate('/checkout')
  }

  const checkPincode = async () => {
    setPincodeMsg('')
    setPincodeAvailable(null)

    const enteredPincode = pincode.trim()

    if (!/^[0-9]{6}$/.test(enteredPincode)) {
      setPincodeMsg('Please enter a valid 6-digit pincode')
      setPincodeAvailable(false)
      return
    }

    setPincodeLoading(true)

    try {
      const res = await axios.post(`${apiUrl}/check/book/pincode`, {
        book: id,
        pinCode: enteredPincode
      })

      const responseData = res.data

      const availability =
        responseData?.data?.isAvailable ??
        responseData?.isAvailable ??
        responseData?.data?.available

      setPincodeAvailable(availability === true)

      setPincodeMsg(
        responseData?.message ||
          (availability === true
            ? 'Delivery is available at this pincode'
            : 'Delivery not available at this pincode')
      )
    } catch (err) {
      setPincodeAvailable(false)
      setPincodeMsg(
        err.response?.data?.message || 'Delivery not available at this pincode'
      )
    } finally {
      setPincodeLoading(false)
      setPincode('')
    }
  }

  if (!book._id) {
    return (
      <Container className='py-5 text-center'>
        <div className='spinner-border text-primary' />
        <p className='mt-3 text-muted'>Loading book details...</p>
      </Container>
    )
  }

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      <Container className='py-4'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <Button
            variant='link'
            className='text-primary text-decoration-none fw-semibold p-0'
            onClick={() => navigate('/')}
          >
            <i className='bi bi-arrow-left me-2' />
            Back to Home
          </Button>

          <Badge bg='primary' className='px-3 py-2'>
            G.K.P BookStore
          </Badge>
        </div>

        <Card className='border-0 shadow-sm rounded-3'>
          <Card.Body className='p-3 p-md-4'>
            <Row className='g-4'>
              <Col lg={5} md={5}>
                <div
                  className='d-flex align-items-center justify-content-center rounded-3 p-3'
                  style={{
                    background: '#f8f9fa',
                    minHeight: '440px',
                    border: '1px solid #edf0f3'
                  }}
                >
                  {book.bookImage ? (
                    <img
                      src={book.bookImage}
                      alt={book.bookTittle}
                      className='img-fluid'
                      style={{
                        maxHeight: '400px',
                        width: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div className='text-muted'>No Image Available</div>
                  )}
                </div>

                <Row className='g-2 mt-2'>
                  <Col xs={6}>
                    <Button
                      variant='warning'
                      className='w-100 fw-semibold py-3'
                      onClick={addToCart}
                    >
                      <i className='bi bi-cart3 me-2' />
                      ADD TO CART
                    </Button>
                  </Col>

                  <Col xs={6}>
                    <Button
                      variant='success'
                      className='w-100 fw-semibold py-3'
                      onClick={buyNow}
                    >
                      <i className='bi bi-lightning-fill me-2' />
                      BUY NOW
                    </Button>
                  </Col>
                </Row>

                {cartMessage && (
                  <div
                    className={`text-center fw-semibold mt-3 ${
                      cartMessage === 'Item already added to cart'
                        ? 'text-danger'
                        : 'text-success'
                    }`}
                  >
                    {cartMessage}
                  </div>
                )}
              </Col>

              <Col lg={7} md={7}>
                <h3 className='fw-semibold mb-2' style={{ color: '#212121' }}>
                  {book.bookTittle || '-'}
                </h3>

                <p className='text-secondary mb-3'>
                  By{' '}
                  <span className='text-primary fw-semibold'>
                    {book.authorName || '-'}
                  </span>
                </p>

                {book.rating && (
                  <div className='mb-3'>
                    <Badge bg='success' className='me-2'>
                      {book.rating} <i className='bi bi-star-fill' />
                    </Badge>
                    <span className='text-muted small'>
                      {book.reviews || 0} Reviews
                    </span>
                  </div>
                )}

                <hr />

                <div className='mb-3'>
                  <h5 className='fw-semibold mb-3'>Price Details</h5>

                  <div className='d-flex align-items-center gap-3 flex-wrap mb-2'>
                    <span
                      className='fw-bold'
                      style={{ fontSize: '25px', color: '#172b3d' }}
                    >
                      ₹{finalPrice.toFixed(2)}
                    </span>

                    {hasDiscount && (
                      <>
                        <s className='text-secondary'>
                          ₹{originalPrice.toFixed(2)}
                        </s>

                        <span className='fw-bold text-success'>
                          {book.discountType === 'Percentage'
                            ? `${discountValue}% Off`
                            : `₹${discountValue} Off`}
                        </span>
                      </>
                    )}
                  </div>

                  <div className='text-secondary small mb-1'>
                    Price per book: ₹{finalPrice.toFixed(2)}
                  </div>

                  {hasDiscount && totalSavings > 0 && (
                    <div className='text-success fw-semibold mt-2'>
                      You Save ₹{totalSavings.toFixed(2)}
                    </div>
                  )}
                </div>

                <Badge bg='success' className='px-3 py-2'>
                  Best Price
                </Badge>

                <p className='text-success fw-semibold mt-2 mb-0'>
                  <i className='bi bi-check-circle-fill me-2' />
                  Available for purchase
                </p>

                {book.shortDescription && (
                  <div className='mt-4'>
                    <h5 className='fw-semibold'>About this book</h5>
                    <p className='text-secondary' style={{ lineHeight: '1.7' }}>
                      {book.shortDescription}
                    </p>
                  </div>
                )}

                <div className='mt-4'>
                  <h5 className='fw-semibold mb-3'>Delivery Options</h5>

                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      checkPincode()
                    }}
                  >
                    <div className='d-flex gap-2 flex-wrap'>
                      <div style={{ maxWidth: '260px', flex: '1 1 180px' }}>
                        <Form.Control
                          type='text'
                          inputMode='numeric'
                          autoComplete='postal-code'
                          placeholder='Enter 6 digit pincode'
                          value={pincode}
                          maxLength={6}
                          onChange={e => {
                            const value = e.target.value
                              .replace(/[^0-9]/g, '')
                              .slice(0, 6)

                            setPincode(value)
                            setPincodeMsg('')
                            setPincodeAvailable(null)
                          }}
                        />
                      </div>

                      <Button
                        type='submit'
                        variant='outline-primary'
                        disabled={pincodeLoading}
                        className='fw-semibold'
                      >
                        {pincodeLoading ? 'Checking...' : 'Check'}
                      </Button>
                    </div>

                    {pincodeMsg && (
                      <p
                        className={`small fw-semibold mt-2 mb-0 ${
                          pincodeAvailable ? 'text-success' : 'text-danger'
                        }`}
                      >
                        <i
                          className={`bi ${
                            pincodeAvailable
                              ? 'bi-check-circle-fill'
                              : 'bi-exclamation-circle-fill'
                          } me-2`}
                        />
                        {pincodeMsg}
                      </p>
                    )}
                  </Form>

                  <div className='mt-4'>
                    <div className='d-flex align-items-center gap-3 mb-3'>
                      <i className='bi bi-truck fs-4 text-primary' />
                      <div>
                        <div className='fw-semibold'>Delivery Information</div>
                        <small className='text-muted'>
                          Check availability using your pincode
                        </small>
                      </div>
                    </div>

                    <div className='d-flex align-items-center gap-3 mb-3'>
                      <i className='bi bi-arrow-repeat fs-4 text-primary' />
                      <div>
                        <div className='fw-semibold'>Easy Shopping</div>
                        <small className='text-muted'>
                          Order your favourite books online
                        </small>
                      </div>
                    </div>

                    <div className='d-flex align-items-center gap-3'>
                      <i className='bi bi-shield-check fs-4 text-primary' />
                      <div>
                        <div className='fw-semibold'>Secure Checkout</div>
                        <small className='text-muted'>
                          Continue to checkout to place your order
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className='border-0 shadow-sm rounded-3 mt-4'>
          <Card.Body className='p-3 p-md-4'>
            <h4 className='fw-semibold mb-3'>Specifications</h4>

            <Row className='g-0'>
              <Col md={6}>
                <BookDetailLocal label='Author' value={book.authorName} />
                <BookDetailLocal label='Publisher' value={book.publisher} />
                <BookDetailLocal label='Imprint' value={book.imprint} />
                <BookDetailLocal
                  label='Publication Year'
                  value={book.publicationYear}
                />
                <BookDetailLocal label='ISBN' value={book.isbnNo} />
                <BookDetailLocal label='Edition' value={book.edition} />
              </Col>

              <Col md={6}>
                <BookDetailLocal label='Language' value={book.language} />
                <BookDetailLocal label='Genre' value={book.genre} />
                <BookDetailLocal label='Category' value={book.bookCategory} />
                <BookDetailLocal label='Rating' value={book.rating} />
                <BookDetailLocal label='Reviews' value={book.reviews} />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {book.description && (
          <Card className='border-0 shadow-sm rounded-3 mt-4'>
            <Card.Body className='p-3 p-md-4'>
              <h4 className='fw-semibold mb-3'>Product Description</h4>
              <p className='text-secondary mb-0' style={{ lineHeight: '1.8' }}>
                {book.description}
              </p>
            </Card.Body>
          </Card>
        )}

        <Card className='border-0 shadow-sm rounded-3 mt-4'>
          <Card.Body className='p-3 p-md-4'>
            <h4 className='fw-semibold mb-3'>Product Highlights</h4>

            <Row className='g-0'>
              <Col md={6}>
                <BookDetailLocal
                  label='Country of Origin'
                  value={book.countryOfOrigin}
                />
                <BookDetailLocal
                  label='Product From'
                  value={book.productFrom}
                />
                <BookDetailLocal
                  label='Manufacturer'
                  value={book.nameOfManufacturer}
                />
              </Col>

              <Col md={6}>
                <BookDetailLocal
                  label='Manufacturer Address'
                  value={book.addressOfManufacturer}
                />
                <BookDetailLocal label='Packager' value={book.nameOfPackager} />
                <BookDetailLocal
                  label='Packager Address'
                  value={book.addressOfPackager}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

function BookDetailLocal ({ label, value }) {
  return (
    <div className='d-flex border-bottom py-3 px-2'>
      <div className='text-secondary' style={{ width: '45%' }}>
        {label}
      </div>

      <div
        className='fw-semibold text-dark'
        style={{ width: '55%', overflowWrap: 'anywhere' }}
      >
        {value ?? '-'}
      </div>
    </div>
  )
}

export default BookDetail
