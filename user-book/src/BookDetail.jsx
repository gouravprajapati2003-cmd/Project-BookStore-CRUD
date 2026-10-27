import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, clearCartMessage } from './feactures/cart/cartSlice'
import axios from 'axios'
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

function BookDetail () {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()

  // Book state
  const [book, setBook] = useState({})

  // Cart message from Redux
  const cartMessage = useSelector(state => state.cart.message)

  // Pincode state
  const [pincode, setPincode] = useState('')
  const [pincodeMsg, setPincodeMsg] = useState('')
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [pincodeAvailable, setPincodeAvailable] = useState(null)

  // Get Book Details
  useEffect(() => {
    axios
      .get(`${apiUrl}/user/book/${id}`)
      .then(res => {
        setBook(res.data.data || {})
        dispatch(clearCartMessage())
      })
      .catch(err => {
        console.log('Book fetch error:', err)
      })
  }, [id, dispatch])

  // Add To Cart
  const addToCart = () => {
    if (!book._id) return

    dispatch(addProduct(book))
  }

  // Check Pincode
  const checkPincode = async () => {
    setPincodeMsg('')
    setPincodeAvailable(null)

    const enteredPincode = pincode.trim()

    // Validate 6 digit pincode
    if (!/^[0-9]{6}$/.test(enteredPincode)) {
      setPincodeMsg('Please enter a valid 6-digit pincode')
      setPincodeAvailable(false)
      return
    }

    setPincodeLoading(true)

    try {
      const res = await axios.post(
        `${apiUrl}/check/book/pincode`,
        {
          book: id,
          pinCode: enteredPincode
        }
      )

      const responseData = res.data

      const availability =
        responseData?.data?.isAvailable ??
        responseData?.isAvailable ??
        responseData?.data?.available

      setPincodeAvailable(availability === true)

      if (availability === true) {
        setPincodeMsg(
          responseData?.message ||
          'Delivery is available at this pincode'
        )
      } else {
        setPincodeMsg(
          responseData?.message ||
          'Delivery not available at this pincode'
        )
      }
    } catch (err) {
      console.log('Pincode check error:', err)

      setPincodeAvailable(false)

      if (err.response?.data?.message) {
        setPincodeMsg(err.response.data.message)
      } else {
        setPincodeMsg('Delivery not available at this pincode')
      }
    } finally {
      setPincodeLoading(false)
      setPincode('')
    }
  }
  function buyNow() {
    dispatch(addProduct(book))
    navigate('/checkout')
  }

  return (
    <Container className='py-4'>
      {/* Back Button */}
      <Button
        variant='dark'
        className='mb-4'
        onClick={() => navigate('/')}
      >
        ← Back
      </Button>

      {/* Main Book Card */}
      <Card className='shadow-sm border-1'>
        <Card.Body>
          <Row>
            {/* Book Image */}
            <Col md={4} className='text-center'>
              {book.bookImage ? (
                <img
                  src={book.bookImage}
                  alt={book.bookTittle || 'Book'}
                  className='img-fluid'
                  style={{
                    width: '100%',
                    maxWidth: '350px',
                    height: '450px',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div
                  className='d-flex align-items-center justify-content-center border rounded'
                  style={{
                    width: '100%',
                    maxWidth: '350px',
                    height: '450px',
                    margin: 'auto'
                  }}
                >
                  No Image
                </div>
              )}

              <Button
                className='mt-4'
                style={{ width: '100%', maxWidth: '345px' }}
                size='lg'
                variant='warning'
                onClick={addToCart}
              >
                Add To Cart
              </Button>

              {/* Cart Message */}
              {cartMessage && (
                <div
                  className={
                    cartMessage === 'Item already added to cart'
                      ? 'text-danger mt-2 fw-semibold'
                      : 'text-success mt-2 fw-semibold'
                  }
                >
                  {cartMessage}
                </div>
              )}
            </Col>

            {/* Book Information */}
            <Col md={8}>
              <h2 className='fw-bold'>
                {book.bookTittle || '-'}
              </h2>

              <p className='text-muted fs-5'>
                By {book.authorName || '-'}
              </p>

              <hr />

              {/* Price */}
              <div className='mb-4'>
                <h4 className='fw-bold text-success'>
                  ₹{book.originalPrice ?? '-'}
                </h4>
              </div>

              {/* Short Description */}
              {book.shortDescription && (
                <div className='mb-4'>
                  <h5 className='fw-bold'>About this book</h5>
                  <p>{book.shortDescription}</p>
                </div>
              )}

              {/* Book Details */}
              <h5 className='fw-bold mb-3'>Book Details</h5>

              <BookDetailLocal
                label='Author'
                value={book.authorName}
              />

              <BookDetailLocal
                label='Imprint'
                value={book.imprint}
              />

              <BookDetailLocal
                label='Publisher'
                value={book.publisher}
              />

              <BookDetailLocal
                label='Publication Year'
                value={book.publicationYear}
              />

              <BookDetailLocal
                label='ISBN'
                value={book.isbnNo}
              />

              <BookDetailLocal
                label='Edition'
                value={book.edition}
              />

              <BookDetailLocal
                label='Language'
                value={book.language}
              />

              <BookDetailLocal
                label='Genre'
                value={book.genre}
              />

              <BookDetailLocal
                label='Category'
                value={book.bookCategory}
              />

              <BookDetailLocal
                label='Rating'
                value={book.rating}
              />

              <BookDetailLocal
                label='Reviews'
                value={book.reviews}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Pincode + Cart + Buy Now */}
      <Row className='align-items-start justify-content-end g-3 mt-2'>
        {/* Pincode Section */}
        <Col xs={12} lg='auto'>
          <Form
            onSubmit={e => {
              e.preventDefault()
              checkPincode()
            }}
          >
            <div className='d-flex align-items-center gap-2 flex-wrap'>
              <h5 className='mb-0'>Check Delivery:</h5>

              <Form.Control
                type='text'
                inputMode='numeric'
                autoComplete='postal-code'
                placeholder='Enter Pincode'
                value={pincode}
                maxLength={6}
                style={{ width: '180px' }}
                onChange={e => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, '')
                    .slice(0, 6)

                  setPincode(value)
                  setPincodeMsg('')
                  setPincodeAvailable(null)
                }}
              />

              <Button
                type='submit'
                variant='primary'
                disabled={pincodeLoading}
              >
                {pincodeLoading ? 'Checking...' : 'Check'}
              </Button>
            </div>

            {/* Pincode Message */}
            {pincodeMsg && (
              <div className='mt-2'>
                <small
                  className={
                    pincodeAvailable === true
                      ? 'fw-semibold text-success'
                      : 'fw-semibold text-danger'
                  }
                  role='status'
                >
                  {pincodeMsg}
                </small>
              </div>
            )}
          </Form>
        </Col>

        {/* Add To Cart */}
        <Col xs={12} sm='auto'>
          <Button
            className='w-100'
            style={{ minWidth: '180px' }}
            size='lg'
            variant='warning'
            onClick={addToCart}
          >
            Add To Cart
          </Button>
        </Col>

        {/* Buy Now */}
        <Col xs={12} sm='auto'>
          <Button
            className='w-100'
            style={{ minWidth: '180px' }}
            size='lg'
            variant='success'
            onClick={buyNow}
          >
            Buy Now
          </Button>
        </Col>
      </Row>

      {/* Description */}
      {book.description && (
        <Card className='shadow-sm border-1 mt-4'>
          <Card.Body>
            <h4 className='fw-bold'>Description</h4>
            <p className='mt-3'>{book.description}</p>
          </Card.Body>
        </Card>
      )}

      {/* Product Highlights */}
      <Card className='shadow-sm border-1 mt-4'>
        <Card.Body>
          <h4 className='fw-bold mb-3'>Product Highlights</h4>

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

          <BookDetailLocal
            label='Manufacturer Address'
            value={book.addressOfManufacturer}
          />

          <BookDetailLocal
            label='Packager'
            value={book.nameOfPackager}
          />

          <BookDetailLocal
            label='Packager Address'
            value={book.addressOfPackager}
          />
        </Card.Body>
      </Card>
    </Container>
  )
}

// Reusable Book Detail Row
function BookDetailLocal ({ label, value }) {
  return (
    <Row className='border-bottom py-2'>
      <Col xs={5} className='text-muted'>
        {label}
      </Col>

      <Col xs={7} className='fw-semibold'>
        {value ?? '-'}
      </Col>
    </Row>
  )
}

export default BookDetail



