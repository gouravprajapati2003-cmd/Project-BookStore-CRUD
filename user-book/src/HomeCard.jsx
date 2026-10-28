import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ImageSlider from './ImageSlider.jsx'

const apiUrl = import.meta.env.VITE_API_URL

function HomeCard () {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])

  useEffect(() => {
    axios({
      url: apiUrl + '/user/books',
      method: 'get'
    })
      .then((res) => {
        setBooks(Array.isArray(res.data.data) ? res.data.data : [])
      })
      .catch((err) => {
        console.error('Error fetching books:', err)
      })
  }, [])

  function goToDetailPage (id) {
    navigate('/user/book/detail/' + id)
  }

  return (
    <>
      {/* Book Card Hover Effect */}
      <style>
        {`
          .book-card {
            height: 100%;
            border: 1px solid #e5eaf0 !important;
            border-radius: 14px !important;
            overflow: hidden;
            cursor: pointer;
            background: #ffffff;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .book-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 26px rgba(0, 0, 0, 0.14) !important;
          }

          .book-card .book-image {
            transition: transform 0.35s ease;
          }

          .book-card:hover .book-image {
            transform: scale(1.05);
          }

          .book-card .view-details-btn {
            background-color: #172b3d;
            border: none;
            transition: background-color 0.3s ease;
          }

          .book-card:hover .view-details-btn {
            background-color: #0d6efd;
          }

          @media (prefers-reduced-motion: reduce) {
            .book-card,
            .book-card .book-image,
            .book-card .view-details-btn {
              transition: none;
            }
          }
        `}
      </style>

      <Container
        fluid
        className='px-4 pt-2 pb-4'
        style={{
          backgroundColor: '#f5f7fa',
          minHeight: '100vh'
        }}
      >
        <ImageSlider />

        {/* Books */}
        <Row className='g-4 mt-1'>
          {books.map((book) => (
            <Col key={book._id} xs={12} sm={6} lg={4}>
              <Card
                onClick={() => goToDetailPage(book._id)}
                className='book-card'
              >
                <Card.Body
                  className='d-flex align-items-center gap-4'
                  style={{
                    padding: '20px',
                    minHeight: '250px'
                  }}
                >
                  {/* Book Image + Future Button Space */}
                  <div
                    style={{
                      width: '135px',
                      minWidth: '135px',
                      height: '215px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    {/* Book Image */}
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        className='book-image'
                        src={book.bookImage}
                        alt={book.bookTittle}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                    </div>

                    {/* Reserved Space for Future Button */}
                    <div
                      className='book-image-button-space'
                      style={{
                        width: '100%',
                        height: '45px',
                        marginTop: '10px'
                      }}
                    >
                      {/* Add your future button here */}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div
                    className='d-flex flex-column flex-grow-1'
                    style={{
                      minWidth: 0,
                      minHeight: '210px'
                    }}
                  >
                    {/* Book Title */}
                    <Card.Title
                      className='fw-bold mb-3'
                      style={{
                        fontSize: '18px',
                        lineHeight: '1.4',
                        color: '#172b3d',
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {book.bookTittle}
                    </Card.Title>

                    {/* Author */}
                    <div
                      className='text-secondary mb-3'
                      style={{ fontSize: '14px' }}
                    >
                      <i className='bi bi-person-fill me-2'></i>
                      {book.authorName}
                    </div>

                    {/* Publication Year */}
                    <div
                      className='text-secondary mb-3'
                      style={{ fontSize: '14px' }}
                    >
                      <i className='bi bi-calendar3 me-2'></i>
                      {book.publicationYear}
                    </div>

                    {/* Price and Availability */}
                    <div className='d-flex flex-wrap align-items-center gap-2 mb-3'>
                      <span
                        className='fw-bold'
                        style={{
                          fontSize: '23px',
                          color: '#172b3d'
                        }}
                      >
                        &#x20B9;{book.originalPrice}
                      </span>

                      <Badge
                        bg='success'
                        style={{
                          fontSize: '12px',
                          padding: '7px 9px',
                          borderRadius: '6px'
                        }}
                      >
                        Available
                      </Badge>
                    </div>

                    {/* View Details Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        goToDetailPage(book._id)
                      }}
                      className='view-details-btn w-100 mt-auto'
                      style={{
                        borderRadius: '9px',
                        padding: '9px 6px',
                        fontSize: '15px'
                      }}
                    >
                      <i className='bi bi-eye-fill me-2'></i>
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Empty State */}
        {books.length === 0 && (
          <div className='text-center py-5 text-secondary'>
            No books available right now.
          </div>
        )}
      </Container>
    </>
  )
}

export default HomeCard
