import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, clearCartMessage } from './feactures/cart/cartSlice'
import axios from 'axios'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Spinner,
  Modal
} from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

const theme = {
  primary: '#123B4A',
  secondary: '#176B68',
  accent: '#18A999',
  light: '#E9F7F5',
  background: '#F5F8FA',
  text: '#263B43',
  muted: '#71838A',
  border: '#E5ECEE',
  white: '#FFFFFF',
  buyNow: '#F4C542',
  buyNowText: '#3E4435',
  success: '#198754',
  categoryBg: '#D2E4DD',
  categoryText: '#315B50',
  categoryBorder: '#BBD4C9',
  availabilityBg: '#D1E8D6',
  availabilityText: '#28613C',
  availabilityBorder: '#B9D9C1',
  discountBg: '#EBDDAD',
  discountText: '#74551D',
  discountBorder: '#D9C78F',
  star: '#F4B400'
}

function getActiveDiscount (product) {
  const discounts = Array.isArray(product?.DiscountDetail)
    ? product.DiscountDetail
    : product?.DiscountDetail
    ? [product.DiscountDetail]
    : []

  const now = new Date()

  return (
    discounts.find(discount => {
      const isActive = discount.status?.toLowerCase() === 'active'
      const validFrom =
        !discount.validFrom || now >= new Date(discount.validFrom)
      const validTo = !discount.validTo || now <= new Date(discount.validTo)

      return isActive && validFrom && validTo
    }) || null
  )
}

function BookDetail () {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()

  const [book, setBook] = useState({})
  const [loading, setLoading] = useState(true)

  const [ratingSummary, setRatingSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })

  const cartProducts = useSelector(state => state.cart.products || [])

  const [hasAddedToCart, setHasAddedToCart] = useState(false)
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const [showAlreadyAdded, setShowAlreadyAdded] = useState(false)

  const [pincode, setPincode] = useState('')
  const [pincodeMsg, setPincodeMsg] = useState('')
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [pincodeAvailable, setPincodeAvailable] = useState(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        setHasAddedToCart(false)
        setShowAddedMessage(false)
        setShowAlreadyAdded(false)

        const res = await axios.get(`${apiUrl}/user/book/${id}`)
        const bookData = res.data.data || {}

        setBook(bookData)

        dispatch(clearCartMessage())
      } catch (err) {
        console.log('Book fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id, dispatch])

  const isAlreadyInCart =
    Boolean(book._id) &&
    cartProducts.some(item => {
      return (
        String(item._id) === String(book._id) ||
        String(item.book?._id) === String(book._id)
      )
    })

  // Discount is supplied by the API inside the DiscountDetail array.
  const activeDiscount = getActiveDiscount(book)
  const discountValue = Number(activeDiscount?.discountValue || 0)
  const originalPrice = Number(book.originalPrice ?? book.price ?? 0)
  const hasDiscount = Boolean(activeDiscount && discountValue > 0)

  const finalPrice = hasDiscount
    ? activeDiscount.discountType === 'Percentage'
      ? Math.max(0, originalPrice - (originalPrice * discountValue) / 100)
      : activeDiscount.discountType === 'Fixed'
      ? Math.max(0, originalPrice - discountValue)
      : originalPrice
    : originalPrice

  const totalSavings = Math.max(0, originalPrice - finalPrice)

  // Add to Cart
  const addToCart = () => {
    if (!book._id) return

    if (isAlreadyInCart || hasAddedToCart) {
      setShowAddedMessage(false)
      setShowAlreadyAdded(true)
      return
    }

    dispatch(addProduct(book))
    setHasAddedToCart(true)
    setShowAddedMessage(true)
  }

  // Buy Now
  const buyNow = () => {
    if (!book._id) return

    dispatch(
      addProduct({
        ...book,
        quantity: 1
      })
    )

    navigate('/checkout', {
      state: {
        buyNowProduct: {
          ...book,
          quantity: 1
        }
      }
    })
  }

  // Pincode Availability
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

  if (loading) {
    return (
      <div
        className='d-flex flex-column align-items-center justify-content-center'
        style={{ minHeight: '70vh', background: theme.background }}
      >
        <Spinner animation='border' style={{ color: theme.accent }} />
        <p className='mt-3 text-secondary'>Loading book details...</p>
      </div>
    )
  }

  if (!book._id) {
    return (
      <Container className='text-center py-5'>
        <i className='bi bi-book fs-1' style={{ color: theme.muted }} />
        <h5 className='mt-3'>Book not found</h5>
        <Button
          className='mt-3 border-0'
          style={{ background: theme.primary }}
          onClick={() => navigate('/')}
        >
          Back to Store
        </Button>
      </Container>
    )
  }

  return (
    <div
      style={{
        background: theme.background,
        minHeight: '100vh',
        color: theme.text
      }}
    >
      <Container className='py-4 py-md-5'>
        {/* Breadcrumb */}
        <div className='d-flex align-items-center justify-content-between mb-4'>
          <div className='small'>
            <span
              role='button'
              onClick={() => navigate('/')}
              style={{ color: theme.secondary }}
            >
              Home
            </span>
            <i className='bi bi-chevron-right mx-2 text-secondary' />
            <span className='text-secondary'>Book Details</span>
          </div>

          <Button
            variant='link'
            className='text-decoration-none p-0 fw-semibold'
            style={{ color: theme.secondary }}
            onClick={() => navigate('/')}
          >
            <i className='bi bi-arrow-left me-2' />
            Back to Store
          </Button>
        </div>

        {/* Main Product Card */}
        <Card
          className='border-0 overflow-hidden'
          style={{
            borderRadius: '18px',
            boxShadow: '0 8px 35px rgba(18,59,74,0.07)'
          }}
        >
          <Card.Body className='p-3 p-md-4 p-lg-5'>
            <Row className='g-4'>
              {/* Book Image */}
              <Col lg={4} md={5}>
                <div
                  className='position-relative d-flex align-items-center justify-content-center rounded-4'
                  style={{
                    minHeight: '330px',
                    height: 'auto',
                    padding: '18px',
                    background: 'linear-gradient(145deg, #EDF7F5, #F8FBFA)',
                    border: `1px solid ${theme.border}`
                  }}
                >
                  {hasDiscount && (
                    <Badge
                      bg='transparent'
                      className='position-absolute top-0 start-0 m-3 px-3 py-2'
                      style={{
                        backgroundColor: theme.discountBg,
                        color: theme.discountText,
                        border: `1px solid ${theme.discountBorder}`,
                        borderRadius: '7px'
                      }}
                    >
                      <i className='bi bi-tag-fill me-1' />
                      {activeDiscount?.discountType === 'Percentage'
                        ? `${discountValue}% OFF`
                        : `₹${discountValue} OFF`}
                    </Badge>
                  )}

                  {book.bookImage ? (
                    <img
                      src={book.bookImage}
                      alt={book.bookTittle}
                      style={{
                        display: 'block',
                        width: 'auto',
                        maxWidth: '100%',
                        height: 'auto',
                        maxHeight: '390px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 12px 12px rgba(0,0,0,0.15))'
                      }}
                    />
                  ) : (
                    <div className='text-center text-secondary'>
                      <i className='bi bi-book fs-1' />
                      <p className='mb-0 mt-2'>No Image Available</p>
                    </div>
                  )}
                </div>

                {/* Trust Strip */}
                <div
                  className='d-flex justify-content-center gap-3 flex-wrap mt-3 py-3'
                  style={{
                    borderTop: `1px solid ${theme.border}`,
                    borderBottom: `1px solid ${theme.border}`
                  }}
                >
                  <span className='small text-secondary'>
                    <i
                      className='bi bi-shield-check me-1'
                      style={{ color: theme.accent }}
                    />
                    Secure Payment
                  </span>
                  <span className='small text-secondary'>
                    <i
                      className='bi bi-truck me-1'
                      style={{ color: theme.accent }}
                    />
                    Delivery Check
                  </span>
                </div>
              </Col>

              {/* Book Information */}
              <Col lg={8} md={7}>
                <div className='d-flex flex-wrap gap-2 mb-3'>
                  <Badge
                    bg='transparent'
                    className='px-3 py-2'
                    style={{
                      backgroundColor: theme.categoryBg,
                      color: theme.categoryText,
                      border: `1px solid ${theme.categoryBorder}`,
                      borderRadius: '7px',
                      fontWeight: '600'
                    }}
                  >
                    {book.bookCategory || 'Books'}
                  </Badge>

                  <Badge
                    bg='transparent'
                    className='px-3 py-2'
                    style={{
                      backgroundColor: theme.availabilityBg,
                      color: theme.availabilityText,
                      border: `1px solid ${theme.availabilityBorder}`,
                      borderRadius: '7px',
                      fontWeight: '600'
                    }}
                  >
                    <i className='bi bi-check-circle-fill me-1' />
                    Available for Purchase
                  </Badge>
                </div>

                <h2
                  className='fw-bold mb-2'
                  style={{
                    color: theme.primary,
                    fontSize: 'clamp(23px, 3vw, 32px)',
                    lineHeight: '1.35'
                  }}
                >
                  {book.bookTittle || '-'}
                </h2>

                <p className='mb-3' style={{ color: theme.muted }}>
                  By{' '}
                  <span
                    className='fw-semibold'
                    style={{ color: theme.secondary }}
                  >
                    {book.authorName || '-'}
                  </span>
                </p>

                {/* Dynamic Average Rating and Review Count */}
                <div className='d-flex align-items-center gap-3 mb-3 flex-wrap'>
                  {ratingSummary.totalReviews > 0 ? (
                    <>
                      {/* Average Rating */}
                      <div
                        className='d-inline-flex align-items-center gap-1 px-3 py-2 rounded-2'
                        style={{
                          backgroundColor: '#388E3C',
                          color: '#FFFFFF',
                          fontSize: '15px',
                          fontWeight: '600',
                          letterSpacing: '0.3px'
                        }}
                      >
                        {Number(ratingSummary.averageRating).toFixed(1)}
                        <i
                          className='bi bi-star-fill'
                          style={{
                            color: '#FFD700',
                            fontSize: '13px'
                          }}
                        />
                      </div>
                      {/* Ratings and Reviews Count */}
                      <div className='d-flex flex-column'>
                        <span
                          className='fw-semibold'
                          style={{
                            color: theme.text,
                            fontSize: '14px'
                          }}
                        >
                          {ratingSummary.totalReviews.toLocaleString('en-IN')}{' '}
                          Ratings
                          {' & '}
                          Reviews
                        </span>

                        <span
                          className='small text-secondary'
                          style={{ fontSize: '12px' }}
                        >
                          Customer feedback
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className='d-flex align-items-center gap-2'>
                      <span
                        className='px-3 py-2 rounded-2 fw-semibold'
                        style={{
                          backgroundColor: '#F1F3F6',
                          color: '#555555',
                          fontSize: '13px'
                        }}
                      >
                        New
                      </span>
                      <span className='small text-secondary'>
                        No ratings or reviews yet
                      </span>
                    </div>
                  )}
                </div>

                <hr style={{ borderColor: theme.border }} />

                {/* Price */}
                <div
                  className='rounded-4 p-3 p-md-4 my-3'
                  style={{
                    background: '#F0F8F6',
                    border: '1px solid #DCEDEA'
                  }}
                >
                  <div
                    className='small fw-semibold mb-2'
                    style={{ color: theme.muted }}
                  >
                    SPECIAL PRICE
                  </div>

                  <div className='d-flex align-items-center flex-wrap gap-3'>
                    <span
                      className='fw-bold'
                      style={{ fontSize: '34px', color: theme.primary }}
                    >
                      ₹{finalPrice.toFixed(2)}
                    </span>

                    {hasDiscount && (
                      <s className='fs-5 text-secondary'>
                        ₹{originalPrice.toFixed(2)}
                      </s>
                    )}

                    {hasDiscount && (
                      <Badge
                        bg='transparent'
                        className='px-3 py-2'
                        style={{
                          backgroundColor: theme.discountBg,
                          color: theme.discountText,
                          border: `1px solid ${theme.discountBorder}`,
                          borderRadius: '7px',
                          fontWeight: '600'
                        }}
                      >
                        {activeDiscount?.discountType === 'Percentage'
                          ? `${discountValue}% OFF`
                          : `₹${discountValue} OFF`}
                      </Badge>
                    )}
                  </div>

                  <div className='small text-secondary mt-2'>
                    Inclusive of all applicable prices
                  </div>

                  {hasDiscount && totalSavings > 0 && (
                    <div
                      className='fw-semibold mt-2'
                      style={{ color: theme.secondary }}
                    >
                      <i className='bi bi-patch-check-fill me-2' />
                      You save ₹{totalSavings.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Short Description */}
                {book.shortDescription && (
                  <div className='my-4'>
                    <h5
                      className='fw-bold mb-2'
                      style={{ color: theme.primary }}
                    >
                      About This Book
                    </h5>
                    <p
                      className='mb-0'
                      style={{ color: theme.muted, lineHeight: '1.8' }}
                    >
                      {book.shortDescription}
                    </p>
                  </div>
                )}

                {/* Delivery Checker */}
                <div
                  className='rounded-4 p-3 p-md-4 mt-3'
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <div className='d-flex align-items-center gap-2 mb-3'>
                    <i
                      className='bi bi-geo-alt-fill fs-4'
                      style={{ color: theme.accent }}
                    />
                    <div>
                      <h6
                        className='fw-bold mb-0'
                        style={{ color: theme.primary }}
                      >
                        Check Delivery Availability
                      </h6>
                      <small className='text-secondary'>
                        Enter your pincode to check delivery
                      </small>
                    </div>
                  </div>

                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      checkPincode()
                    }}
                  >
                    <div className='d-flex gap-2 flex-wrap'>
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
                        style={{
                          maxWidth: '280px',
                          minWidth: '180px',
                          borderRadius: '9px',
                          padding: '11px 13px',
                          borderColor: theme.border
                        }}
                      />

                      <Button
                        type='submit'
                        disabled={pincodeLoading}
                        className='px-4 fw-semibold border-0'
                        style={{
                          background: theme.primary,
                          color: '#FFFFFF',
                          borderRadius: '9px'
                        }}
                      >
                        {pincodeLoading ? (
                          <>
                            <Spinner
                              size='sm'
                              animation='border'
                              className='me-2'
                            />
                            Checking
                          </>
                        ) : (
                          'Check'
                        )}
                      </Button>
                    </div>

                    {pincodeMsg && (
                      <div
                        className={`small fw-semibold mt-3 ${
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
                      </div>
                    )}
                  </Form>

                  {/* Purchase Buttons */}
                  <Row className='g-2 mt-3'>
                    <Col sm={6}>
                      <Button
                        className='w-100 py-3 fw-semibold border-0'
                        onClick={addToCart}
                        style={{
                          background: theme.accent,
                          color: '#FFFFFF',
                          borderRadius: '10px',
                          boxShadow: '0 5px 14px rgba(24,169,153,0.18)'
                        }}
                      >
                        <i className='bi bi-cart3 me-2' />
                        Add to Cart
                      </Button>

                      <div
                        className='text-center mt-2'
                        style={{ minHeight: '24px' }}
                      >
                        {showAddedMessage && (
                          <span
                            className='small fw-semibold'
                            style={{ color: theme.success }}
                          >
                            <i className='bi bi-check-circle-fill me-1' />
                            Added to Cart
                          </span>
                        )}
                      </div>
                    </Col>

                    <Col sm={6}>
                      <Button
                        className='w-100 py-3 fw-semibold border-0'
                        onClick={buyNow}
                        style={{
                          background: theme.buyNow,
                          color: theme.buyNowText,
                          borderRadius: '10px',
                          boxShadow: '0 5px 14px rgba(244,197,66,0.25)'
                        }}
                      >
                        <i className='bi bi-lightning-fill me-2' />
                        Buy Now
                      </Button>
                    </Col>
                  </Row>

                  <div className='text-center mt-2'>
                    <small className='text-secondary'>
                      <i className='bi bi-lock-fill me-1' />
                      Safe and secure checkout experience
                    </small>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Book Specifications */}
        <DetailSection title='Book Specifications' icon='bi-journal-text'>
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

              {/* Average Rating with Gold Star */}
              <div
                className='d-flex border-bottom py-3 px-2'
                style={{ borderColor: theme.border }}
              >
                <div
                  className='small'
                  style={{ width: '45%', color: theme.muted }}
                >
                  Rating
                </div>

                <div
                  className='fw-semibold small d-flex align-items-center'
                  style={{ width: '55%', color: theme.text }}
                >
                  {ratingSummary.totalReviews > 0 ? (
                    <>
                      {Number(ratingSummary.averageRating).toFixed(1)} / 5
                      <i
                        className='bi bi-star-fill ms-2'
                        style={{ color: theme.star }}
                      />
                    </>
                  ) : (
                    'No ratings yet'
                  )}
                </div>
              </div>

              {/* Dynamic Review Count */}
              <BookDetailLocal
                label='Reviews'
                value={`${ratingSummary.totalReviews.toLocaleString(
                  'en-IN'
                )} Reviews`}
              />
            </Col>
          </Row>
        </DetailSection>

        {/* Customer Reviews */}
        <ReviewSection bookId={book._id} onSummaryChange={setRatingSummary} />

        {/* Product Description */}
        {book.description && (
          <DetailSection title='Product Description' icon='bi-card-text'>
            <p
              className='mb-0'
              style={{
                color: theme.muted,
                lineHeight: '1.9',
                whiteSpace: 'pre-line'
              }}
            >
              {book.description}
            </p>
          </DetailSection>
        )}

        {/* Product Highlights */}
        <DetailSection title='Product Highlights' icon='bi-box-seam'>
          <Row className='g-0'>
            <Col md={6}>
              <BookDetailLocal
                label='Country of Origin'
                value={book.countryOfOrigin}
              />
              <BookDetailLocal label='Product From' value={book.productFrom} />
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
        </DetailSection>

        <div className='text-center py-4'>
          <small className='text-secondary'>
            <i
              className='bi bi-heart-fill me-1'
              style={{ color: theme.accent }}
            />
            Thank you for shopping with G.K.P BookStore
          </small>
        </div>
      </Container>

      {/* Already Added Modal */}
      <Modal
        show={showAlreadyAdded}
        onHide={() => setShowAlreadyAdded(false)}
        centered
      >
        <Modal.Body className='text-center p-4 p-md-5'>
          <div
            className='rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3'
            style={{
              width: '72px',
              height: '72px',
              background: theme.light,
              color: theme.secondary
            }}
          >
            <i className='bi bi-cart-check-fill fs-2' />
          </div>

          <h4 className='fw-bold mb-2' style={{ color: theme.primary }}>
            Already Added to Cart!
          </h4>

          <p className='text-secondary mb-4'>
            This book is already in your cart. You cannot add the same book
            again from this page.
          </p>

          <div className='d-flex gap-2 justify-content-center flex-wrap'>
            <Button
              variant='outline-secondary'
              onClick={() => setShowAlreadyAdded(false)}
              className='px-3'
            >
              Continue Shopping
            </Button>

            <Button
              className='border-0 px-4'
              style={{
                background: theme.accent,
                color: '#FFFFFF'
              }}
              onClick={() => navigate('/cart')}
            >
              <i className='bi bi-cart3 me-2' />
              View Cart
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

/* Reusable Section */
function DetailSection ({ title, icon, children }) {
  return (
    <Card
      className='border-0 mt-4'
      style={{
        borderRadius: '16px',
        boxShadow: '0 5px 25px rgba(18,59,74,0.05)'
      }}
    >
      <Card.Body className='p-3 p-md-4'>
        <h5 className='fw-bold mb-3' style={{ color: theme.primary }}>
          <i className={`bi ${icon} me-2`} style={{ color: theme.secondary }} />
          {title}
        </h5>
        {children}
      </Card.Body>
    </Card>
  )
}

/* Reusable Specification Row */
function BookDetailLocal ({ label, value }) {
  return (
    <div
      className='d-flex border-bottom py-3 px-2'
      style={{ borderColor: theme.border }}
    >
      <div className='small' style={{ width: '45%', color: theme.muted }}>
        {label}
      </div>

      <div
        className='fw-semibold small'
        style={{
          width: '55%',
          color: theme.text,
          overflowWrap: 'anywhere'
        }}
      >
        {value ?? '-'}
      </div>
    </div>
  )
}

/* Review Section */
function ReviewSection ({ bookId, onSummaryChange }) {
  const [reviews, setReviews] = useState([])

  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })

  const [loadingReviews, setLoadingReviews] = useState(true)
  const [sortBy, setSortBy] = useState('recent')

  const token = localStorage.getItem('userToken')

  const fetchReviews = useCallback(async () => {
    try {
      setLoadingReviews(true)

      const [reviewRes, summaryRes] = await Promise.all([
        axios.get(`${apiUrl}/user/book/${bookId}/reviews`),
        axios.get(`${apiUrl}/user/book/${bookId}/rating`)
      ])

      const fetchedReviews = reviewRes.data.reviews || []
      const fetchedSummary = summaryRes.data

      setReviews(fetchedReviews)
      setSummary(fetchedSummary)
      onSummaryChange?.(fetchedSummary)
    } catch (error) {
      console.log('Review fetch error:', error)
    } finally {
      setLoadingReviews(false)
    }
  }, [bookId, onSummaryChange])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Helpful Vote
  const markHelpful = async reviewId => {
    if (!token) {
      alert('Please login first to vote.')
      return
    }

    try {
      await axios.post(
        `${apiUrl}/user/review/${reviewId}/helpful`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      await fetchReviews()
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to mark review helpful.')
    }
  }

  // Review Sorting
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating
    if (sortBy === 'lowest') return a.rating - b.rating

    if (sortBy === 'helpful') {
      return (b.helpfulCount || 0) - (a.helpfulCount || 0)
    }

    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const StarDisplay = ({ value, size = '16px' }) => (
    <span style={{ color: theme.star, fontSize: size }}>
      {[1, 2, 3, 4, 5].map(star => (
        <i
          key={star}
          className={`bi ${
            star <= Number(value) ? 'bi-star-fill' : 'bi-star'
          } me-1`}
        />
      ))}
    </span>
  )

  return (
    <Card
      className='border-0 mt-4'
      style={{
        borderRadius: '16px',
        boxShadow: '0 5px 25px rgba(18,59,74,0.05)'
      }}
    >
      <Card.Body className='p-3 p-md-4'>
        <h5 className='fw-bold mb-4' style={{ color: theme.primary }}>
          <i className='bi bi-star-half me-2' />
          Customer Reviews & Ratings
        </h5>

        {loadingReviews ? (
          <div className='text-center py-4'>
            <Spinner animation='border' style={{ color: theme.accent }} />
          </div>
        ) : (
          <>
            {/* Rating Summary */}
            <Row className='g-4 align-items-center mb-4'>
              <Col md={4} className='text-center'>
                <h1
                  className='fw-bold mb-1'
                  style={{ color: theme.primary, fontSize: '48px' }}
                >
                  {Number(summary.averageRating || 0).toFixed(1)}
                  <small className='fs-5'>/5</small>
                </h1>

                <StarDisplay
                  value={Math.round(summary.averageRating || 0)}
                  size='20px'
                />

                <p className='small text-secondary mt-2 mb-0'>
                  {summary.totalReviews || 0} Customer Ratings
                </p>
              </Col>

              <Col md={8}>
                {[5, 4, 3, 2, 1].map(star => {
                  const count = summary.ratingBreakdown?.[star] || 0

                  const percentage =
                    summary.totalReviews > 0
                      ? (count / summary.totalReviews) * 100
                      : 0

                  return (
                    <div
                      key={star}
                      className='d-flex align-items-center gap-2 mb-2'
                    >
                      <span
                        className='small fw-semibold'
                        style={{ width: '35px' }}
                      >
                        {star}{' '}
                        <i
                          className='bi bi-star-fill'
                          style={{ color: theme.star }}
                        />
                      </span>

                      <div
                        className='progress flex-grow-1'
                        style={{ height: '9px', background: '#E9EEF0' }}
                      >
                        <div
                          className='progress-bar'
                          style={{
                            width: `${percentage}%`,
                            background: theme.accent
                          }}
                        />
                      </div>

                      <span
                        className='small text-secondary'
                        style={{ width: '30px' }}
                      >
                        {count}
                      </span>
                    </div>
                  )
                })}
              </Col>
            </Row>

            <hr />

            {/* Review List Header */}
            <div className='d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3'>
              <h6 className='fw-bold mb-0' style={{ color: theme.primary }}>
                Customer Reviews ({reviews.length})
              </h6>

              <Form.Select
                size='sm'
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ width: '190px' }}
              >
                <option value='recent'>Most Recent</option>
                <option value='highest'>Highest Rating</option>
                <option value='lowest'>Lowest Rating</option>
                <option value='helpful'>Most Helpful</option>
              </Form.Select>
            </div>

            {/* Customer Reviews */}
            {sortedReviews.length === 0 ? (
              <div className='text-center py-4'>
                <i className='bi bi-chat-square-text fs-1 text-secondary' />
                <p className='text-secondary mt-2 mb-0'>No reviews yet.</p>
              </div>
            ) : (
              sortedReviews.map(review => (
                <div
                  key={review._id}
                  className='py-3 border-bottom'
                  style={{ borderColor: theme.border }}
                >
                  <div className='d-flex justify-content-between flex-wrap gap-2'>
                    <div>
                      <div
                        className='fw-semibold'
                        style={{ color: theme.primary }}
                      >
                        {review.userName || 'Customer'}
                      </div>

                      <StarDisplay value={review.rating} />

                      <div className='fw-semibold mt-2'>{review.title}</div>
                    </div>

                    <small className='text-secondary'>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString('en-IN')
                        : ''}
                    </small>
                  </div>

                  {review.isVerifiedPurchase && (
                    <div
                      className='small fw-semibold mt-2'
                      style={{ color: theme.secondary }}
                    >
                      <i className='bi bi-patch-check-fill me-1' />
                      Verified Purchase
                    </div>
                  )}

                  <p
                    className='mt-2 mb-2'
                    style={{ color: theme.muted, lineHeight: '1.7' }}
                  >
                    {review.comment}
                  </p>

                  <Button
                    size='sm'
                    variant='outline-secondary'
                    onClick={() => markHelpful(review._id)}
                  >
                    <i className='bi bi-hand-thumbs-up me-1' />
                    Helpful ({review.helpfulCount || 0})
                  </Button>
                </div>
              ))
            )}
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default BookDetail
