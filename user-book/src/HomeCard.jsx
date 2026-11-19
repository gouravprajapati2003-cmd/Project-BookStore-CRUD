import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap'
import ImageSlider from './ImageSlider.jsx'

const apiUrl = import.meta.env.VITE_API_URL

function HomeCard () {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const searchBook = searchParams.get('search') || ''

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function fetchBooks () {
    try {
      setLoading(true)
      setError(false)

      const res = await axios.get(`${apiUrl}/user/books`)

      setBooks(Array.isArray(res.data.data) ? res.data.data : [])
    } catch (err) {
      console.error('Error fetching books:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const filteredBooks = useMemo(() => {
    const search = searchBook.trim().toLowerCase()

    if (!search) return books

    return books.filter(book => {
      const title = String(book.bookTittle || '').toLowerCase()
      const author = String(book.authorName || '').toLowerCase()

      return title.includes(search) || author.includes(search)
    })
  }, [books, searchBook])

  function goToDetailPage (id) {
    navigate('/user/book/detail/' + id)
  }

  return (
    <>
      <style>
        {`
          .home-container {
            background: #fbfaf6;
            min-height: 100vh;
            color: #173d3a;
            font-family: Georgia, 'Times New Roman', serif;
          }

          .page-container {
            max-width: 1450px;
            margin: auto;
          }

          /* HERO SECTION */

          .home-hero {
            position: relative;
            padding: 30px 0 15px;
          }

          .hero-label {
            display: inline-block;
            background: #dff0e7;
            color: #176b61;
            padding: 8px 17px;
            border-radius: 30px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 15px;
          }

          .hero-title {
            color: #172c32;
            font-size: clamp(32px, 5vw, 58px);
            font-weight: 800;
            line-height: 1.08;
            letter-spacing: -2px;
          }

          .hero-title em {
            color: #087b70;
          }

          .hero-description {
            color: #737d79;
            font-family: Arial, sans-serif;
            font-size: 15px;
            line-height: 1.8;
            max-width: 480px;
          }

          .hero-btn {
            background: #087b70 !important;
            border: 1px solid #087b70 !important;
            color: white !important;
            border-radius: 30px !important;
            padding: 11px 23px !important;
            font-family: Arial, sans-serif;
            font-size: 13px !important;
            font-weight: 700 !important;
          }

          .hero-btn:hover {
            background: #075e56 !important;
          }

          /* COLLECTION */

          .collection-section {
            padding: 35px 0 45px;
          }

          .section-eyebrow {
            color: #16877a;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-family: Arial, sans-serif;
          }

          .section-heading {
            color: #173d3a;
            font-size: clamp(25px, 3vw, 36px);
            font-weight: 800;
            letter-spacing: -1px;
            margin-bottom: 7px;
          }

          .section-subtitle {
            color: #858e88;
            font-family: Arial, sans-serif;
            font-size: 14px;
          }

          .book-count {
            background: #e5f2ec;
            color: #087b70;
            border: 1px solid #cce6da;
            border-radius: 30px;
            padding: 10px 18px;
            font-family: Arial, sans-serif;
            font-size: 13px;
            font-weight: 700;
          }

          .section-divider {
            height: 1px;
            background: #e7e5dc;
            margin: 22px 0;
          }

          /* HORIZONTAL BOOK CARD */

          .book-card {
            height: 100%;
            min-height: 220px;
            display: flex;
            flex-direction: row;
            background: #fff !important;
            border: 1px solid #e9e9df !important;
            border-radius: 15px !important;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(35, 67, 54, 0.05);
            transition: all 0.3s ease;
          }

          .book-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 26px rgba(35, 67, 54, 0.12);
            border-color: #b8d9ca !important;
          }

          /* LEFT SIDE IMAGE */

          .book-image-area {
            position: relative;
            width: 38%;
            min-width: 38%;
            min-height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #EAE4D9;
            padding: 12px 9px;
          }

          .book-image {
            width: 100%;
            height: 145px;
            object-fit: contain;
            filter: drop-shadow(0 7px 7px rgba(0,0,0,0.15));
            transition: transform 0.3s ease;
          }

          .book-card:hover .book-image {
            transform: scale(1.06);
          }

          /* DISCOUNT BADGE */

          .discount-badge {
            position: absolute;
            top: 9px;
            left: 7px;
            z-index: 2;
            background: #d9534f;
            color: white;
            padding: 5px 7px;
            border-radius: 20px;
            font-family: Arial, sans-serif;
            font-size: 9px;
            font-weight: 700;
          }

          /* RIGHT SIDE DETAILS */

          .book-card .card-body {
            width: 62%;
            min-width: 0;
            padding: 13px !important;
            display: flex;
            flex-direction: column;
            flex: 1;
            font-family: Arial, sans-serif;
          }

          .availability-badge {
            background: #e7f5ec;
            color: #25834c;
            border-radius: 20px;
            padding: 4px 7px;
            font-size: 9px;
            font-weight: 700;
            white-space: nowrap;
          }

          .rating-text {
            color: #e5a323;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
          }

          .book-title {
            color: #173d3a;
            font-size: 14px;
            font-weight: 800;
            line-height: 1.4;
            min-height: 39px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .book-meta {
            color: #89918b;
            font-size: 11px;
            line-height: 1.5;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          /* PRICE */

          .book-price {
            color: #087b70;
            font-size: 19px;
            font-weight: 800;
          }

          .old-price {
            color: #a3aaa4;
            font-size: 11px;
          }

          .saving-text {
            color: #26834c;
            font-size: 10px;
            font-weight: 700;
          }

          /* BUTTON */

          .view-details-btn {
            background: #087b70 !important;
            border: none !important;
            border-radius: 22px !important;
            padding: 8px !important;
            color: white !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            transition: all 0.25s ease !important;
          }

          .view-details-btn:hover {
            background: #075e56 !important;
          }

          /* EMPTY STATE */

          .empty-books {
            background: #fff;
            border: 1px solid #e9e9df;
            border-radius: 16px;
            padding: 45px 15px;
            color: #858e88;
          }

          .empty-icon {
            color: #16877a;
          }

          .retry-btn {
            background: #087b70 !important;
            border: none !important;
          }

          /* QUOTE */

          .book-quote {
            text-align: center;
            padding: 35px 15px;
            margin: 15px 0 35px;
            background: #edf4ed;
            border-radius: 18px;
          }

          .book-quote p {
            color: #173d3a;
            font-size: clamp(17px, 2.5vw, 23px);
            font-weight: 700;
            font-style: italic;
            margin-bottom: 10px;
          }

          .book-quote span {
            color: #16877a;
            font-family: Arial, sans-serif;
            font-size: 13px;
            font-weight: 700;
          }

          /* TABLET */

          @media (min-width: 576px) and (max-width: 991px) {
            .book-card {
              min-height: 210px;
            }

            .book-image-area {
              width: 36%;
              min-width: 36%;
              min-height: 210px;
            }

            .book-card .card-body {
              padding: 11px !important;
            }

            .book-title {
              font-size: 13px;
            }
          }

          /* MOBILE */

          @media (max-width: 575px) {
            .home-hero {
              padding-top: 20px;
            }

            .book-card {
              min-height: 190px;
            }

            .book-image-area {
              width: 38%;
              min-width: 38%;
              min-height: 190px;
              padding: 7px;
            }

            .book-image {
              height: 120px;
            }

            .book-card .card-body {
              padding: 11px !important;
            }

            .book-title {
              font-size: 13px;
            }

            .book-price {
              font-size: 17px;
            }
          }

          .home-card-section {
            margin-bottom: 0 !important;
            padding-bottom: 20px !important;
          }

          .quote-section {
            margin-bottom: 0 !important;
            padding-bottom: 25px !important;
          }
        `}
      </style>

      <Container fluid className='home-container px-3 px-md-4 pb-4'>
        <div className='page-container'>
          {/* HERO SECTION */}

          <section className='home-hero' id='home'>
            <span className='hero-label'>A little escape, delivered</span>

            <Row className='align-items-center g-4'>
              <Col lg={5}>
                <h1 className='hero-title'>
                  Find a book.
                  <br />
                  <em>Find yourself.</em>
                </h1>

                <p className='hero-description mt-3'>
                  Explore a world of stories, discover timeless classics and
                  find your next favourite book at G.K.P BookStore.
                </p>

                <Button
                  className='hero-btn mt-2'
                  onClick={() =>
                    document
                      .getElementById('collection')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Explore Collection
                  <i className='bi bi-arrow-right ms-2'></i>
                </Button>
              </Col>

              <Col lg={7}>
                <div className='overflow-hidden rounded-4'>
                  <ImageSlider />
                </div>
              </Col>
            </Row>
          </section>

          {/* COLLECTION SECTION */}

          <section className='collection-section' id='collection'>
            <div className='d-flex justify-content-between align-items-end flex-wrap gap-3'>
              <div>
                <span className='section-eyebrow'>Handpicked for readers</span>

                <h2 className='section-heading mt-2'>Explore Our Collection</h2>

                <p className='section-subtitle mb-0'>
                  Find Your Next Favourite Book at G.K.P BookStore
                </p>
              </div>

              <div className='book-count'>
                <i className='bi bi-book-half me-2'></i>
                {books.length} Books
              </div>
            </div>

            <div className='section-divider'></div>

            {/* SEARCH RESULT */}

            {!loading && !error && searchBook.trim() && (
              <div className='mb-4'>
                <span className='section-subtitle'>Search results for</span>

                <strong className='ms-2' style={{ color: '#087b70' }}>
                  "{searchBook}"
                </strong>

                <span className='section-subtitle ms-2'>
                  ({filteredBooks.length} books found)
                </span>
              </div>
            )}

            {/* LOADING */}

            {loading && (
              <div className='text-center py-5'>
                <Spinner
                  animation='border'
                  style={{
                    color: '#087b70',
                    width: '3rem',
                    height: '3rem'
                  }}
                />

                <p className='section-subtitle mt-3'>
                  Discovering your next favourite book...
                </p>
              </div>
            )}

            {/* ERROR */}

            {error && !loading && (
              <div className='empty-books text-center'>
                <i className='bi bi-exclamation-circle display-4 text-danger'></i>

                <h5 className='fw-bold mt-3'>Unable to Load Books</h5>

                <p>Something went wrong. Please try again.</p>

                <Button className='retry-btn px-4' onClick={fetchBooks}>
                  <i className='bi bi-arrow-clockwise me-2'></i>
                  Retry
                </Button>
              </div>
            )}

            {/* BOOK GRID */}

            {!loading &&
              !error &&
              (filteredBooks.length > 0 ? (
                <Row className='g-3 g-xl-4'>
                  {filteredBooks.map(book => {
                    const discount = book.DiscountDetail?.[0]
                    const discountValue = Number(discount?.discountValue) || 0

                    const hasDiscount =
                      discount?.status === 'Active' &&
                      discountValue > 0 &&
                      discountValue <= 100

                    const originalPrice = Number(book.originalPrice) || 0

                    const finalPrice = hasDiscount
                      ? originalPrice - (originalPrice * discountValue) / 100
                      : originalPrice

                    const saving = originalPrice - finalPrice

                    return (
                      <Col key={book._id} xs={12} sm={6} lg={4}>
                        <Card
                          className='book-card'
                          onClick={() => goToDetailPage(book._id)}
                        >
                          {/* LEFT SIDE BOOK COVER */}

                          <div className='book-image-area'>
                            {hasDiscount && (
                              <span className='discount-badge'>
                                {discountValue}% OFF
                              </span>
                            )}

                            <img
                              className='book-image'
                              src={book.bookImage}
                              alt={book.bookTittle || 'Book'}
                              loading='lazy'
                            />
                          </div>

                          {/* RIGHT SIDE BOOK DETAILS */}

                          <Card.Body>
                            <div className='d-flex justify-content-between align-items-center flex-wrap gap-1 mb-3'>
                              <span className='availability-badge'>
                                <i className='bi bi-check-circle-fill me-1'></i>
                                Available
                              </span>

                              <span className='rating-text'>
                                <i className='bi bi-star-fill me-1'></i>
                                {book.rating || 'New'}
                              </span>
                            </div>

                            <Card.Title className='book-title mb-2'>
                              {book.bookTittle || 'Untitled Book'}
                            </Card.Title>

                            <div className='book-meta mb-2'>
                              <i className='bi bi-person me-2'></i>
                              {book.authorName || 'Unknown Author'}
                            </div>

                            <div className='book-meta mb-3'>
                              <i className='bi bi-calendar3 me-2'></i>
                              {book.publicationYear || 'N/A'}
                            </div>

                            {/* PRICE AND BUTTON */}

                            <div className='mt-auto'>
                              <div className='d-flex align-items-center flex-wrap gap-2 mb-2'>
                                <span className='book-price'>
                                  ₹{finalPrice.toFixed(2)}
                                </span>

                                {hasDiscount && (
                                  <span className='old-price text-decoration-line-through'>
                                    ₹{originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {hasDiscount && (
                                <div className='saving-text mb-2'>
                                  <i className='bi bi-tag-fill me-1'></i>
                                  You save ₹{saving.toFixed(2)}
                                </div>
                              )}

                              <Button
                                className='view-details-btn w-100 mt-2'
                                onClick={e => {
                                  e.stopPropagation()
                                  goToDetailPage(book._id)
                                }}
                              >
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
              ) : (
                <div className='empty-books text-center mt-4'>
                  <i className='bi bi-book empty-icon display-3 d-block mb-3'></i>

                  <h5 className='fw-bold text-dark'>
                    {searchBook.trim()
                      ? 'No Matching Books Found'
                      : 'No Books Available'}
                  </h5>

                  <p className='mb-3'>
                    {searchBook.trim()
                      ? 'Try another book title or author name.'
                      : 'We are adding new books to our collection.'}
                  </p>

                  {searchBook.trim() && (
                    <Button
                      variant='outline-success'
                      onClick={() => navigate('/', { replace: true })}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ))}
          </section>

          {/* QUOTE SECTION */}

          <section className='book-quote'>
            <div style={{ fontSize: '35px', color: '#16877a' }}>“</div>

            <p>A room without books is like a body without a soul.</p>

            <span>— Cicero</span>
          </section>
        </div>
      </Container>
    </>
  )
}

export default HomeCard
