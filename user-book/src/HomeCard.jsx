import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

function HomeCard () {
  let [books, setBooks] = useState([])

  useEffect(() => {
    axios({
      url: apiUrl + '/user/books',
      method: 'get'
    })
      .then(res => {
        setBooks(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <Container
  fluid
  className='px-4 py-4'
  style={{
    backgroundColor: '#f5f7fa',
    minHeight: '100vh'
  }}
>
      {/* Heading */}
      <div className='text-center mb-2'>
        <div className='d-flex align-items-center justify-content-center gap-2 mb-2'>
        </div>
      </div>

      {/* Books */}
      <Row className='g-4'>
        {books.map((book, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3}>
            <Card
  className='h-100 border-0'
  style={{
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.12)'
  }}
>
              {/* Image Section */}
              <div
                style={{
                  height: '250px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '10px'
                }}
              >
                <img
                  src={book.bookImage}
                  alt={book.bookTittle}
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>

              {/* Card Body */}
              <Card.Body
                className='d-flex flex-column'
                style={{
                  padding: '15px 18px'
                }}
              >
                {/* Book Title */}
                <Card.Title
                  className='fw-bold mb-2'
                  style={{
                    fontSize: '17px',
                    color: '#172b3d',
                    minHeight: '42px'
                  }}
                >
                  {book.bookTittle}
                </Card.Title>

                {/* Author */}
                <div
                  className='text-secondary mb-2'
                  style={{
                    fontSize: '16px'
                  }}
                >
                  <i className='bi bi-person-fill me-2'></i>
                  {book.authorName}
                </div>

                {/* Publication Year */}
                <div
                  className='text-secondary mb-3'
                  style={{
                    fontSize: '16px'
                  }}
                >
                  <i className='bi bi-calendar3 me-2'></i>
                  {book.publicationYear}
                </div>

                {/* Price + Available */}
                <div className='d-flex align-items-center mb-3'>
                  <span
                    className='fw-bold'
                    style={{
                      fontSize: '25px',
                      color: '#172b3d'
                    }}
                  >
                    &#x20B9;{book.originalPrice}
                  </span>

                  <Badge
                    bg='success'
                    className='ms-2'
                    style={{
                      fontSize: '14px',
                      padding: '7px 10px',
                      borderRadius: '7px'
                    }}
                  >
                    Available
                  </Badge>
                </div>

                {/* View Details Button */}
                <Button
                  variant='dark'
                  className='w-100 mt-auto'
                  style={{
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '17px',
                    backgroundColor: '#172126',
                    border: 'none'
                  }}
                >
                  <i className='bi bi-eye-fill me-2'></i>
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default HomeCard
