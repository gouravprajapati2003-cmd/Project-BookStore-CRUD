import 'bootstrap/dist/css/bootstrap.min.css'

import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

function BookDetail () {
  const { id } = useParams()
  const navigate = useNavigate()

  const [book, setBook] = useState({
    bookTittle: '',
    authorName: '',
    imprint: '',
    publicationYear: '',
    productFrom: '',
    publisher: '',
    genre: '',
    isbnNo: '',
    bookCategory: '',
    edition: '',
    language: '',
    description: '',
    shortDescription: '',
    countryOfOrigin: '',
    nameOfManufacturer: '',
    addressOfManufacturer: '',
    nameOfPackager: '',
    addressOfPackager: '',
    rating: '',
    reviews: '',
    originalPrice: '',
    bookImage: ''
  })

  useEffect(() => {
    axios({
      url: apiUrl + '/book/' + id,
      method: 'get'
    })
      .then(res => {
        console.log('BOOK DETAIL RESPONSE:', res.data)

        setBook(res.data.data)
      })
      .catch(err => {
        console.log('BOOK DETAIL ERROR:', err)
        alert('Unable to fetch book details')
      })
  }, [id])

  return (
    <Container className='py-4'>
      {/* Back Button */}
      <Button
        variant='secondary'
        className='mb-4'
        onClick={() => navigate('/books')}
      >
        ← Back
      </Button>

      {/* Main Book Card */}
      <Card className='shadow-sm border-0'>
        <Card.Body>
          <Row>
            {/* BOOK IMAGE */}
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
            </Col>

            {/* BOOK INFORMATION */}
            <Col md={8}>
              <h2 className='fw-bold'>{book.bookTittle || '-'}</h2>

              <p className='text-muted fs-5'>By {book.authorName || '-'}</p>

              <hr />

              {/* PRICE */}
              <div className='mb-4'>
                <h4 className='fw-bold text-success'>
                  ₹{book.originalPrice || '-'}
                </h4>
              </div>

              {/* SHORT DESCRIPTION */}
              {book.shortDescription && (
                <div className='mb-4'>
                  <h5 className='fw-bold'>About this book</h5>

                  <p>{book.shortDescription}</p>
                </div>
              )}

              {/* BOOK DETAILS */}
              <h5 className='fw-bold mb-3'>Book Details</h5>

              <BookDetailLocal label='Author' value={book.authorName} />

              <BookDetailLocal label='Imprint' value={book.imprint} />

              <BookDetailLocal label='Publisher' value={book.publisher} />

              <BookDetailLocal
                label='Publication Year'
                value={book.publicationYear}
              />

              <BookDetailLocal label='ISBN' value={book.isbnNo} />

              <BookDetailLocal label='Edition' value={book.edition} />

              <BookDetailLocal label='Language' value={book.language} />

              <BookDetailLocal label='Genre' value={book.genre} />

              <BookDetailLocal label='Category' value={book.bookCategory} />

              <BookDetailLocal label='Rating' value={book.rating} />

              <BookDetailLocal label='Reviews' value={book.reviews} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* DESCRIPTION */}
      {book.description && (
        <Card className='shadow-sm border-0 mt-4'>
          <Card.Body>
            <h4 className='fw-bold'>Description</h4>

            <p className='mt-3'>{book.description}</p>
          </Card.Body>
        </Card>
      )}

      {/* PRODUCT INFORMATION */}
      <Card className='shadow-sm border-0 mt-4'>
        <Card.Body>
          <h4 className='fw-bold mb-3'>Product Information</h4>

          <BookDetailLocal
            label='Country of Origin'
            value={book.countryOfOrigin}
          />

          <BookDetailLocal label='Product From' value={book.productFrom} />

          <BookDetailLocal
            label='Manufacturer'
            value={book.nameOfManufacturer}
          />

          <BookDetailLocal
            label='Manufacturer Address'
            value={book.addressOfManufacturer}
          />

          <BookDetailLocal label='Packager' value={book.nameOfPackager} />

          <BookDetailLocal
            label='Packager Address'
            value={book.addressOfPackager}
          />
        </Card.Body>
      </Card>
    </Container>
  )
}

function BookDetailLocal ({ label, value }) {
  return (
    <Row className='border-bottom py-2'>
      <Col xs={5} className='text-muted'>
        {label}
      </Col>

      <Col xs={7} className='fw-semibold'>
        {value || '-'}
      </Col>
    </Row>
  )
}

export default BookDetail
