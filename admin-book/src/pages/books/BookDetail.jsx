import 'bootstrap/dist/css/bootstrap.min.css'

import { useEffect, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap'

import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import {
  FaBook,
  FaArrowLeft,
  FaUser,
  FaStar,
  FaBookOpen,
  FaBuilding,
  FaGlobe,
  FaBarcode,
  FaCalendarAlt,
  FaLanguage,
  FaTag,
  FaBox,
  FaImage
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function BookDetail () {
  const { id } = useParams()
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await axios({
          url: apiUrl + '/book/' + id,
          method: 'get'
        })

        setBook(res.data.data)
      } catch (err) {
        console.log('BOOK DETAIL ERROR:', err)

        setError(err.response?.data?.message || 'Unable to fetch book details.')
      } finally {
        setLoading(false)
      }
    }

    getBookDetails()
  }, [id])

  const DetailItem = ({ icon, label, value }) => (
    <div className='detail-item'>
      <div className='detail-item-icon'>{icon}</div>

      <div className='detail-item-content'>
        <small>{label}</small>
        <div className='detail-item-value'>{value || '-'}</div>
      </div>
    </div>
  )

  const InfoRow = ({ label, value }) => (
    <Row className='info-row'>
      <Col xs={5} className='info-label'>
        {label}
      </Col>

      <Col xs={7} className='info-value'>
        {value || '-'}
      </Col>
    </Row>
  )

  return (
    <Container fluid className='book-detail-page p-3 p-md-4'>
      {/* Header */}
      <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4'>
        <div className='d-flex align-items-center gap-3'>
          <div className='detail-page-icon'>
            <FaBook size={22} />
          </div>

          <div>
            <h4 className='fw-bold mb-1 detail-page-title'>Book Details</h4>

            <small className='text-secondary'>
              View complete book information
            </small>
          </div>
        </div>

        <Button
          variant='light'
          className='detail-back-btn'
          onClick={() => navigate('/books')}
        >
          <FaArrowLeft className='me-2' />
          Back to Books
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className='detail-loading'>
          <Spinner animation='border' variant='success' />
          <p className='text-secondary mt-3'>Loading book details...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <Alert variant='danger' className='shadow-sm'>
          {error}

          <div className='mt-3'>
            <Button
              variant='outline-danger'
              size='sm'
              onClick={() => navigate('/books')}
            >
              Back to Books
            </Button>
          </div>
        </Alert>
      )}

      {/* Book Details */}
      {!loading && !error && book && (
        <>
          {/* Main Book Card */}
          <Card className='detail-main-card mb-4'>
            <Card.Body className='p-3 p-md-4'>
              <Row className='align-items-start'>
                {/* Book Image */}
                <Col xs={12} md={4} lg={3}>
                  <div className='detail-image-box'>
                    {book.bookImage ? (
                      <img
                        src={book.bookImage}
                        alt={book.bookTittle || 'Book cover'}
                        className='detail-book-image'
                        onError={e => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className='no-image-placeholder'>
                        <FaImage size={40} />
                        <p className='mt-2 mb-0'>No Image Available</p>
                      </div>
                    )}
                  </div>
                </Col>

                {/* Main Information */}
                <Col xs={12} md={8} lg={9}>
                  <div className='detail-main-info'>
                    <Badge className='detail-category-badge mb-3'>
                      {book.bookCategory || 'Book'}
                    </Badge>

                    <h3 className='detail-book-title'>
                      {book.bookTittle || '-'}
                    </h3>

                    <div className='detail-author'>
                      <FaUser className='me-2' />
                      By {book.authorName || '-'}
                    </div>

                    <hr className='detail-divider' />

                    {/* Price */}
                    <div className='detail-price-section'>
                      <div>
                        <small className='text-secondary'>Original Price</small>

                        <h3 className='detail-price'>
                          ₹
                          {Number(book.originalPrice || 0).toLocaleString(
                            'en-IN'
                          )}
                        </h3>
                      </div>

                      {book.rating !== '' &&
                        book.rating !== undefined &&
                        book.rating !== null && (
                          <div className='detail-rating'>
                            <FaStar className='me-2' />
                            <strong>{book.rating}</strong>
                            <small className='ms-2 text-secondary'>
                              ({book.reviews || 0} Reviews)
                            </small>
                          </div>
                        )}
                    </div>

                    {/* Short Description */}
                    {book.shortDescription && (
                      <div className='detail-short-description mt-4'>
                        <h6 className='fw-bold mb-2'>About This Book</h6>

                        <p className='mb-0'>{book.shortDescription}</p>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Book Details */}
          <Card className='detail-section-card mb-4'>
            <Card.Body className='p-3 p-md-4'>
              <div className='detail-section-heading'>
                <div className='detail-section-icon'>
                  <FaBookOpen />
                </div>

                <div>
                  <h5 className='fw-bold mb-1'>Book Information</h5>

                  <small className='text-secondary'>
                    General information about this book
                  </small>
                </div>
              </div>

              <hr className='detail-divider' />

              <Row>
                <Col xs={12} md={6} lg={4}>
                  <DetailItem
                    icon={<FaUser />}
                    label='Author'
                    value={book.authorName}
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <DetailItem
                    icon={<FaBuilding />}
                    label='Imprint'
                    value={book.imprint}
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <DetailItem
                    icon={<FaBuilding />}
                    label='Publisher'
                    value={book.publisher}
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <DetailItem
                    icon={<FaCalendarAlt />}
                    label='Publication Year'
                    value={book.publicationYear}
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <DetailItem
                    icon={<FaBarcode />}
                    label='ISBN'
                    value={book.isbnNo}
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <DetailItem
                    icon={<FaBook />}
                    label='Edition'
                    value={book.edition}
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <DetailItem
                    icon={<FaLanguage />}
                    label='Language'
                    value={book.language}
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <DetailItem
                    icon={<FaTag />}
                    label='Genre'
                    value={book.genre}
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <DetailItem
                    icon={<FaBookOpen />}
                    label='Category'
                    value={book.bookCategory}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Description */}
          {book.description && (
            <Card className='detail-section-card mb-4'>
              <Card.Body className='p-3 p-md-4'>
                <div className='detail-section-heading'>
                  <div className='detail-section-icon'>
                    <FaBook />
                  </div>

                  <div>
                    <h5 className='fw-bold mb-1'>Description</h5>

                    <small className='text-secondary'>
                      Complete information about the book
                    </small>
                  </div>
                </div>

                <hr className='detail-divider' />

                <p className='detail-description mb-0'>{book.description}</p>
              </Card.Body>
            </Card>
          )}

          {/* Product Information */}
          <Card className='detail-section-card mb-4'>
            <Card.Body className='p-3 p-md-4'>
              <div className='detail-section-heading'>
                <div className='detail-section-icon'>
                  <FaBox />
                </div>

                <div>
                  <h5 className='fw-bold mb-1'>Product Information</h5>

                  <small className='text-secondary'>
                    Manufacturer and packaging details
                  </small>
                </div>
              </div>

              <hr className='detail-divider' />

              <InfoRow label='Country of Origin' value={book.countryOfOrigin} />

              <InfoRow label='Product From' value={book.productFrom} />

              <InfoRow label='Manufacturer' value={book.nameOfManufacturer} />

              <InfoRow
                label='Manufacturer Address'
                value={book.addressOfManufacturer}
              />

              <InfoRow label='Packager' value={book.nameOfPackager} />

              <InfoRow
                label='Packager Address'
                value={book.addressOfPackager}
              />
            </Card.Body>
          </Card>
        </>
      )}

      {/* Styling */}
      <style>{`
        .book-detail-page {
          min-height: 100%;
          background: #f5f7fb;
        }

        .detail-page-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ccfbf1;
          color: #0f766e;
          border-radius: 12px;
        }

        .detail-page-title {
          color: #172554;
        }

        .detail-back-btn {
          border: 1px solid #e2e8f0;
          color: #334155;
          border-radius: 8px;
          padding: 9px 15px;
          font-size: 13px;
          font-weight: 600;
        }

        .detail-back-btn:hover {
          background: #e2e8f0;
        }

        .detail-main-card,
        .detail-section-card {
          border: 0;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.045);
        }

        .detail-image-box {
          min-height: 340px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 18px;
          background: #f8fafc;
          border: 1px solid #edf0f4;
          border-radius: 10px;
        }

        .detail-book-image {
          width: 100%;
          max-height: 390px;
          object-fit: contain;
        }

        .no-image-placeholder {
          text-align: center;
          color: #94a3b8;
        }

        .detail-category-badge {
          background: #ccfbf1 !important;
          color: #0f766e !important;
          padding: 8px 13px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 6px;
        }

        .detail-book-title {
          color: #172554;
          font-weight: 750;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .detail-author {
          color: #64748b;
          font-size: 15px;
          margin-top: 10px;
        }

        .detail-divider {
          border-color: #e2e8f0;
          margin: 20px 0;
          opacity: 1;
        }

        .detail-price-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
        }

        .detail-price {
          color: #0f766e;
          font-weight: 750;
          margin: 5px 0 0;
        }

        .detail-rating {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 8px;
          color: #d97706;
          font-size: 14px;
        }

        .detail-short-description {
          padding: 16px;
          background: #f8fafc;
          border-radius: 9px;
          border: 1px solid #edf0f4;
        }

        .detail-short-description h6 {
          color: #172554;
        }

        .detail-short-description p,
        .detail-description {
          color: #475569;
          font-size: 14px;
          line-height: 1.8;
          white-space: pre-line;
          overflow-wrap: anywhere;
        }

        .detail-section-heading {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .detail-section-heading h5 {
          color: #1e293b;
          font-size: 16px;
        }

        .detail-section-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #ccfbf1;
          color: #0f766e;
          font-size: 17px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 10px;
          height: 100%;
          border-bottom: 1px solid #edf0f4;
        }

        .detail-item-icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f0fdfa;
          color: #0f766e;
          font-size: 14px;
        }

        .detail-item-content {
          min-width: 0;
        }

        .detail-item-content small {
          color: #94a3b8;
          font-size: 11px;
          display: block;
          margin-bottom: 4px;
        }

        .detail-item-value {
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          overflow-wrap: anywhere;
        }

        .info-row {
          padding: 13px 0;
          border-bottom: 1px solid #edf0f4;
        }

        .info-row:last-child {
          border-bottom: 0;
        }

        .info-label {
          color: #64748b;
          font-size: 13px;
        }

        .info-value {
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          overflow-wrap: anywhere;
          white-space: pre-line;
        }

        .detail-loading {
          min-height: 350px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        @media (max-width: 767px) {
          .detail-image-box {
            min-height: 250px;
            margin-bottom: 25px;
          }

          .detail-book-image {
            max-height: 280px;
          }

          .detail-book-title {
            font-size: 22px;
          }

          .detail-price-section {
            align-items: flex-start;
          }
        }

        @media (max-width: 575px) {
          .book-detail-page {
            padding: 12px !important;
          }

          .detail-page-title {
            font-size: 19px;
          }

          .detail-back-btn {
            width: 100%;
          }

          .detail-main-card .card-body,
          .detail-section-card .card-body {
            padding: 16px !important;
          }

          .detail-section-heading h5 {
            font-size: 14px;
          }

          .info-label,
          .info-value {
            font-size: 12px;
          }
        }
      `}</style>
    </Container>
  )
}

export default BookDetail
