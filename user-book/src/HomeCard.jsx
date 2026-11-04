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
      .then(res => {
        setBooks(Array.isArray(res.data.data) ? res.data.data : [])
      })
      .catch(err => {
        console.error('Error fetching books:', err)
      })
  }, [])

  function goToDetailPage (id) {
    navigate('/user/book/detail/' + id)
  }

  return (
    <>
      <style>
        {`
          .home-container {
            background: #f5f7fb;
            min-height: 100vh;
          }

          .section-heading {
            color: #172b4d;
            font-size: 26px;
            font-weight: 750;
            letter-spacing: -0.6px;
          }

          .section-subtitle {
            color: #8490a3;
            font-size: 14px;
          }

          .book-card {
            height: 100%;
            background: #fff;
            border: 1px solid #edf0f5 !important;
            border-radius: 16px !important;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 14px rgba(20, 40, 80, 0.04);
          }

          .book-card:hover {
            transform: translateY(-7px);
            box-shadow: 0 14px 35px rgba(20, 40, 80, 0.12);
            border-color: #d8e5ff !important;
          }

          .book-image-area {
            height: 220px;
            background: linear-gradient(145deg, #f8faff, #eef3fc);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }

          .book-image {
            width: 145px;
            height: 185px;
            object-fit: contain;
            transition: transform 0.4s ease;
            filter: drop-shadow(0 7px 7px rgba(0,0,0,0.13));
          }

          .book-card:hover .book-image {
            transform: scale(1.07) rotate(-1deg);
          }

          .discount-badge {
            position: absolute;
            top: 13px;
            left: 13px;
            background: #e53935;
            color: #fff;
            border-radius: 6px;
            padding: 5px 9px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.3px;
          }

          .availability-badge {
            background: #e8f8ef;
            color: #16834a;
            border: 1px solid #c9efd9;
            border-radius: 20px;
            padding: 5px 10px;
            font-size: 11px;
            font-weight: 650;
          }

          .book-title {
            color: #172b4d;
            font-size: 16px;
            font-weight: 700;
            line-height: 1.45;
            min-height: 46px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .book-meta {
            color: #8490a3;
            font-size: 13px;
          }

          .book-price {
            color: #172b4d;
            font-size: 23px;
            font-weight: 800;
          }

          .old-price {
            color: #9aa3b2;
            font-size: 13px;
          }

          .saving-text {
            color: #159653;
            font-size: 12px;
            font-weight: 700;
          }

          .view-details-btn {
            background: #1769e0 !important;
            border: none !important;
            border-radius: 9px !important;
            padding: 10px !important;
            font-size: 13px !important;
            font-weight: 650 !important;
            transition: all 0.25s ease !important;
          }

          .view-details-btn:hover {
            background: #0d51b7 !important;
            transform: translateY(-1px);
          }

          .empty-books {
            background: #fff;
            border: 1px dashed #d7dfeb;
            border-radius: 14px;
            padding: 55px 20px;
            color: #8490a3;
          }

          @media (max-width: 575px) {
            .section-heading {
              font-size: 21px;
            }

            .book-image-area {
              height: 195px;
            }

            .book-image {
              height: 165px;
              width: 130px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .book-card,
            .book-image,
            .view-details-btn {
              transition: none !important;
            }
          }
        `}
      </style>

      <Container fluid className='home-container px-3 px-md-4 pt-3 pb-5'>
        <ImageSlider />

        <div className='d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4 mb-3'>
          <div>
            <h2 className='section-heading mb-1'>Explore Our Collection</h2>
            <p className='section-subtitle mb-0'>
              Discover your next favourite book
            </p>
          </div>

          <Badge
            bg='light'
            text='primary'
            className='px-3 py-2'
            style={{
              border: '1px solid #dce7fa',
              borderRadius: '20px',
              fontSize: '12px'
            }}
          >
            <i className='bi bi-book-half me-2'></i>
            {books.length} Books
          </Badge>
        </div>

        <Row className='g-3 g-lg-4 mt-1'>
          {books.map(book => {
            const discount = book.DiscountDetail?.[0]

            const hasDiscount =
              discount?.status === 'Active' &&
              Number(discount?.discountValue) > 0

            const originalPrice = Number(book.originalPrice || 0)

            const finalPrice = hasDiscount
              ? originalPrice -
                (originalPrice * Number(discount.discountValue)) / 100
              : originalPrice

            return (
              <Col key={book._id} xs={12} sm={6} md={4} xl={3}>
                <Card
                  onClick={() => goToDetailPage(book._id)}
                  className='book-card'
                >
                  <div className='book-image-area'>
                    {hasDiscount && (
                      <span className='discount-badge'>
                        {discount.discountValue}% OFF
                      </span>
                    )}

                    <img
                      className='book-image'
                      src={book.bookImage}
                      alt={book.bookTittle}
                    />
                  </div>

                  <Card.Body className='d-flex flex-column p-3'>
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                      <span className='availability-badge'>
                        <i className='bi bi-check-circle-fill me-1'></i>
                        Available
                      </span>

                      <span
                        className='text-warning'
                        style={{ fontSize: '12px' }}
                      >
                        <i className='bi bi-star-fill me-1'></i>
                        {book.rating || 'New'}
                      </span>
                    </div>

                    <Card.Title className='book-title mb-2'>
                      {book.bookTittle}
                    </Card.Title>

                    <div className='book-meta mb-2'>
                      <i className='bi bi-person me-2'></i>
                      {book.authorName || 'Unknown Author'}
                    </div>

                    <div className='book-meta mb-3'>
                      <i className='bi bi-calendar3 me-2'></i>
                      {book.publicationYear || 'N/A'}
                    </div>

                    <div className='d-flex align-items-center flex-wrap gap-2 mb-2'>
                      <span className='book-price'>
                        ₹{finalPrice.toFixed(2)}
                      </span>

                      {hasDiscount && (
                        <>
                          <span className='old-price text-decoration-line-through'>
                            ₹{originalPrice.toFixed(2)}
                          </span>
                          <span className='saving-text'>
                            {discount.discountValue}% Off
                          </span>
                        </>
                      )}
                    </div>

                    <div className='mt-auto pt-2'>
                      <Button
                        onClick={e => {
                          e.stopPropagation()
                          goToDetailPage(book._id)
                        }}
                        className='view-details-btn w-100'
                      >
                        <i className='bi bi-eye-fill me-2'></i>
                        View Details
                        <i className='bi bi-arrow-right ms-2'></i>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>

        {books.length === 0 && (
          <div className='empty-books text-center mt-4'>
            <i className='bi bi-book display-4 d-block mb-3'></i>
            <h5 className='fw-bold text-dark'>No Books Available</h5>
            <p className='mb-0'>
              We are adding new books to our collection. Please check back soon.
            </p>
          </div>
        )}
      </Container>
    </>
  )
}

export default HomeCard
