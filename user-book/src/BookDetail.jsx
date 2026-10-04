import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

function BookDetail () {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id

  // Book state
  const [book, setBook] = useState({})

  // Pincode state
  const [pincode, setPincode] = useState('')
  const [pincodeMsg, setPincodeMsg] = useState('')
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [pincodeAvailable, setPincodeAvailable] = useState(null)

  // Get Book Details
  useEffect(() => {
    axios({
      url: apiUrl + '/user/book/' + id,
      method: 'get'
    })
      .then(res => {
        setBook(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [id])

  // Check Pincode
  const checkPincode = () => {
    // Remove previous message
    setPincodeMsg('')
    setPincodeAvailable(null)

    // Check 6 digit pincode
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeMsg('Please enter a valid 6-digit pincode')
      setPincodeAvailable(false)
      return
    }

    setPincodeLoading(true)

    axios({
      url: apiUrl + '/check/book/pincode',
      method: 'post',
      data: {
        book: id,
        pinCode: pincode
      }
    })
      .then(res => {
        setPincodeMsg(res.data.message)

        if (res.data.data) {
          setPincodeAvailable(res.data.data.isAvailable)
        } else if (typeof res.data.isAvailable !== 'undefined') {
          setPincodeAvailable(res.data.isAvailable)
        }
      })
      .catch(err => {
        console.log(err)

        if (err.response && err.response.data) {
          setPincodeMsg(
            err.response.data.message || 'Delivery not available'
          )
        } else {
          setPincodeMsg('Something went wrong')
        }

        setPincodeAvailable(false)
      })
      .finally(() => {
        setPincodeLoading(false)
      })
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
                  alt={book.bookTittle}
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
                style={{ width: '345px' }}
                size='lg'
                variant='warning'
              >
                Add To Cart
              </Button>
              
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
                  ₹{book.originalPrice || '-'}
                </h4>
              </div>

              {/* Short Description */}
              {book.shortDescription && (
                <div className='mb-4'>
                  <h5 className='fw-bold'>
                    About this book
                  </h5>

                  <p>
                    {book.shortDescription}
                  </p>
                </div>
              )}

              {/* Book Details */}
              <h5 className='fw-bold mb-3'>
                Book Details
              </h5>

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
      <div className='d-flex align-items-start justify-content-end gap-3 mt-3'>

        {/* Pincode Section */}
        <div>

          <div className='d-flex align-items-center gap-2'>

            <h5 className='mb-0'>
              Check Delivery:
            </h5>

            <Form.Control
              type='text'
              placeholder='Enter Pincode'
              value={pincode}
              maxLength={6}
              style={{
                width: '180px'
              }}
              onChange={e => {
                const value = e.target.value
                  .replace(/\D/g, '')
                  .slice(0, 6)

                setPincode(value)
                setPincodeMsg('')
                setPincodeAvailable(null)
              }}
            />

            <Button
              variant='primary'
              onClick={checkPincode}
              disabled={pincodeLoading}
            >
              {pincodeLoading
                ? 'Checking...'
                : 'Check'}
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
              >
                {pincodeMsg}
              </small>

            </div>
          )}

        </div>

        {/* Add To Cart */}
        <Button
          style={{
            width: '180px'
          }}
          size='lg'
          variant='warning'
        >
          Add To Cart
        </Button>

        {/* Buy Now */}
        <Button
          style={{
            width: '180px'
          }}
          size='lg'
          variant='success'
        >
          Buy Now
        </Button>

      </div>

      {/* DESCRIPTION */}
      {book.description && (
        <Card className='shadow-sm border-1 mt-4'>

          <Card.Body>

            <h4 className='fw-bold'>
              Description
            </h4>

            <p className='mt-3'>
              {book.description}
            </p>

          </Card.Body>

        </Card>
      )}

      {/* PRODUCT HIGHLIGHTS */}
      <Card className='shadow-sm border-1 mt-4'>

        <Card.Body>

          <h4 className='fw-bold mb-3'>
            Product Highlights
          </h4>

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

      <Col
        xs={5}
        className='text-muted'
      >
        {label}
      </Col>

      <Col
        xs={7}
        className='fw-semibold'
      >
        {value || '-'}
      </Col>

    </Row>
  )
}

export default BookDetail

