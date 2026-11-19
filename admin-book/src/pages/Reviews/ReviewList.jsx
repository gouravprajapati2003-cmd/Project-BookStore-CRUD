import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Table,
  Pagination,
  Spinner,
  Alert,
  Button,
  Badge
} from 'react-bootstrap'

import {
  FaSearch,
  FaStar,
  FaSyncAlt,
  FaEye,
  FaEyeSlash,
  FaRegCommentDots,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function ReviewList () {
  const [reviews, setReviews] = useState([])
  const [searchReview, setSearchReview] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [pageNo, setPageNo] = useState(1)
  const [limit] = useState(5)

  const [totalReviews, setTotalReviews] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatingReviewId, setUpdatingReviewId] = useState(null)

  // Authentication Headers
  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  // Fetch All Reviews
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const res = await axios.get(`${apiUrl}/admin/reviews`, {
        ...getAuthConfig(),
        params: {
          status: statusFilter,
          search: searchReview.trim(),
          page: pageNo,
          limit
        }
      })

      setReviews(res.data.reviews || [])
      setTotalReviews(res.data.totalReviews || 0)
      setTotalPages(res.data.totalPages || 0)
    } catch (err) {
      console.error('Fetch Reviews Error:', err)

      setError(err.response?.data?.message || 'Reviews load nahi ho sake.')

      setReviews([])
      setTotalReviews(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchReview, pageNo, limit])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Search Handler
  const handleSearch = value => {
    setSearchReview(value)
    setPageNo(1)
  }

  // Status Filter
  const handleStatusFilter = value => {
    setStatusFilter(value)
    setPageNo(1)
  }

  // Update Review Status
  const updateReviewStatus = async (reviewId, newStatus) => {
    try {
      setUpdatingReviewId(reviewId)
      setError('')
      setSuccess('')

      const res = await axios.patch(
        `${apiUrl}/admin/reviews/${reviewId}/status`,
        { status: newStatus },
        getAuthConfig()
      )

      setSuccess(res.data.message || `Review ${newStatus} successfully`)

      // Refresh Reviews
      await fetchReviews()
    } catch (err) {
      console.error('Update Review Error:', err)

      setError(
        err.response?.data?.message || 'Review status update nahi ho saka.'
      )
    } finally {
      setUpdatingReviewId(null)
    }
  }

  // Get Book Name
  const getBookName = review => {
    const book = review.book

    if (!book) return 'Book Deleted'

    if (typeof book === 'string') return 'Book'

    return book.bookTitle || book.bookTittle || book.title || 'Unknown Book'
  }

  // Format Date
  const formatDate = date => {
    if (!date) return 'N/A'

    const value = new Date(date)

    if (Number.isNaN(value.getTime())) return 'N/A'

    return value.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Rating Stars
  const renderStars = rating => {
    const value = Number(rating) || 0

    return (
      <div className='d-flex align-items-center gap-1'>
        {[1, 2, 3, 4, 5].map(star => (
          <FaStar
            key={star}
            size={13}
            color={star <= value ? '#F59E0B' : '#D1D5DB'}
          />
        ))}

        <span className='small fw-semibold ms-1'>{value}/5</span>
      </div>
    )
  }

  // Status Badge
  const getStatusBadge = status => {
    if (status === 'Active') {
      return (
        <Badge
          className='px-3 py-2'
          style={{
            background: '#ecfdf5',
            color: '#fef9c3',
            border: '1px solid #a7f3d0'
          }}
        >
          <FaCheckCircle className='me-1' />
          Active
        </Badge>
      )
    }

    return (
      <Badge
        className='px-3 py-2'
        style={{
          background: '#fff1f2',
          color: '#be123c',
          border: '1px solid #fecdd3'
        }}
      >
        <FaTimesCircle className='me-1' />
        Hidden
      </Badge>
    )
  }

  return (
    <Container
      fluid
      className='review-page p-3 p-md-4'
      style={{
        background: '#f5f7fb',
        minHeight: '100%'
      }}
    >
      {/* Page Header */}
      <Row className='align-items-center mb-4 gy-3'>
        <Col md={6}>
          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center justify-content-center flex-shrink-0'
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '13px',
                background: '#fef3c7',
                color: '#b45309'
              }}
            >
              <FaStar size={22} />
            </div>

            <div>
              <h4 className='fw-bold mb-1' style={{ color: '#172554' }}>
                Manage Reviews
              </h4>

              <small className='text-secondary'>
                Monitor customer ratings and feedback
              </small>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className='d-flex justify-content-md-end gap-2 flex-wrap'>
            <InputGroup style={{ maxWidth: '280px' }}>
              <InputGroup.Text
                className='bg-white border-end-0'
                style={{
                  borderRadius: '8px 0 0 8px'
                }}
              >
                <FaSearch className='text-secondary' />
              </InputGroup.Text>

              <Form.Control
                placeholder='Search Reviews...'
                value={searchReview}
                onChange={e => handleSearch(e.target.value)}
                className='border-start-0 shadow-none'
                style={{
                  borderRadius: '0 8px 8px 0',
                  minHeight: '42px'
                }}
              />
            </InputGroup>

            <Button
              title='Refresh Reviews'
              onClick={fetchReviews}
              disabled={loading}
              className='d-flex align-items-center justify-content-center'
              style={{
                background: '#0f766e',
                border: 'none',
                borderRadius: '8px',
                width: '42px',
                height: '42px'
              }}
            >
              <FaSyncAlt />
            </Button>
          </div>
        </Col>
      </Row>

      {/* Success Message */}
      {success && (
        <Alert variant='success' dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant='danger' dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Summary Card */}
      <Row className='g-3 mb-4'>
        <Col sm={6} xl={3}>
          <Card className='border-0 shadow-sm h-100'>
            <Card.Body className='p-3'>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <small className='text-secondary fw-semibold'>
                    {statusFilter === 'All'
                      ? 'Total Reviews'
                      : `${statusFilter} Reviews`}
                  </small>

                  <h3 className='fw-bold mb-0 mt-2 text-primary'>
                    {loading ? '—' : totalReviews}
                  </h3>
                </div>

                <div
                  className='d-flex align-items-center justify-content-center'
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '11px',
                    background: '#eff6ff',
                    color: '#2563eb'
                  }}
                >
                  <FaRegCommentDots size={21} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reviews Table Card */}
      <Card
        className='border-0 shadow-sm'
        style={{
          borderRadius: '13px',
          overflow: 'hidden'
        }}
      >
        <Card.Body className='p-3 p-md-4'>
          {/* Table Header */}
          <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4'>
            <div>
              <h6 className='fw-bold mb-1' style={{ color: '#1e293b' }}>
                Customer Reviews
              </h6>

              <small className='text-secondary'>
                View and manage customer feedback
              </small>
            </div>

            <Form.Select
              value={statusFilter}
              onChange={e => handleStatusFilter(e.target.value)}
              style={{
                maxWidth: '160px',
                minHeight: '40px',
                borderRadius: '8px'
              }}
            >
              <option value='All'>All Reviews</option>
              <option value='Active'>Active</option>
              <option value='Hidden'>Hidden</option>
            </Form.Select>
          </div>

          {/* Reviews Table */}
          <div className='table-responsive review-table'>
            <Table hover className='align-middle mb-0'>
              <thead>
                <tr>
                  <th className='py-3 px-3'>CUSTOMER</th>
                  <th className='py-3'>BOOK</th>
                  <th className='py-3'>RATING</th>
                  <th className='py-3'>REVIEW</th>
                  <th className='py-3'>DATE</th>
                  <th className='py-3'>STATUS</th>
                  <th className='py-3 text-center'>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='7' className='text-center py-5'>
                      <Spinner animation='border' variant='success' />

                      <p className='text-secondary mt-2 mb-0'>
                        Loading reviews...
                      </p>
                    </td>
                  </tr>
                ) : reviews.length > 0 ? (
                  reviews.map(review => (
                    <tr key={review._id}>
                      {/* Customer */}
                      <td className='px-3'>
                        <span
                          className='fw-semibold'
                          style={{
                            color: '#334155',
                            fontSize: '13px'
                          }}
                        >
                          {review.userName || 'Unknown User'}
                        </span>

                        {review.isVerifiedPurchase && (
                          <div className='small text-success mt-1'>
                            <FaCheckCircle className='me-1' />
                            Verified Purchase
                          </div>
                        )}
                      </td>

                      {/* Book */}
                      <td>
                        <span
                          className='fw-semibold'
                          style={{
                            color: '#475569',
                            fontSize: '13px'
                          }}
                        >
                          {getBookName(review)}
                        </span>
                      </td>

                      {/* Rating */}
                      <td>{renderStars(review.rating)}</td>

                      {/* Review */}
                      <td style={{ minWidth: '220px', maxWidth: '300px' }}>
                        <div
                          className='fw-semibold mb-1'
                          style={{
                            color: '#334155',
                            fontSize: '13px'
                          }}
                        >
                          {review.title || 'No Title'}
                        </div>

                        <div
                          className='text-secondary'
                          style={{
                            fontSize: '12px',
                            lineHeight: '1.5',
                            overflowWrap: 'anywhere'
                          }}
                        >
                          {review.comment || 'No comment'}
                        </div>
                      </td>

                      {/* Date */}
                      <td>
                        <span
                          className='text-secondary'
                          style={{
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {formatDate(review.createdAt)}
                        </span>
                      </td>

                      {/* Status */}
                      <td>{getStatusBadge(review.status)}</td>

                      {/* Action */}
                      <td className='text-center'>
                        <Button
                          size='sm'
                          disabled={updatingReviewId === review._id}
                          onClick={() =>
                            updateReviewStatus(
                              review._id,
                              review.status === 'Active' ? 'Hidden' : 'Active'
                            )
                          }
                          className='d-inline-flex align-items-center gap-2'
                          style={{
                            background:
                              review.status === 'Active'
                                ? '#fff1f2'
                                : '#ecfdf5',
                            color:
                              review.status === 'Active'
                                ? '#be123c'
                                : '#047857',
                            border: `1px solid ${
                              review.status === 'Active' ? '#fecdd3' : '#a7f3d0'
                            }`,
                            borderRadius: '7px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {updatingReviewId === review._id ? (
                            <Spinner size='sm' animation='border' />
                          ) : review.status === 'Active' ? (
                            <>
                              <FaEyeSlash />
                              Hide
                            </>
                          ) : (
                            <>
                              <FaEye />
                              Activate
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='7' className='text-center py-5'>
                      <FaRegCommentDots
                        size={32}
                        className='text-secondary mb-3'
                      />

                      <h6 className='fw-bold text-secondary mb-1'>
                        No Reviews Found
                      </h6>

                      <small className='text-secondary'>
                        {searchReview
                          ? 'Try searching with another keyword.'
                          : 'Customer reviews will appear here.'}
                      </small>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && totalReviews > 0 && (
            <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4'>
              <small className='text-secondary'>
                Showing {(pageNo - 1) * limit + 1} to{' '}
                {Math.min(pageNo * limit, totalReviews)} of {totalReviews}{' '}
                reviews
              </small>

              {totalPages > 1 && (
                <Pagination size='sm' className='mb-0'>
                  <Pagination.Prev
                    disabled={pageNo === 1}
                    onClick={() => setPageNo(prev => prev - 1)}
                  />

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map(page => (
                    <Pagination.Item
                      key={page}
                      active={pageNo === page}
                      onClick={() => setPageNo(page)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}

                  <Pagination.Next
                    disabled={pageNo === totalPages}
                    onClick={() => setPageNo(prev => prev + 1)}
                  />
                </Pagination>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Inline Styling */}
      <style>{`
        .review-page .card {
          border-radius: 12px;
        }

        .review-table {
          border: 1px solid #e2e8f0;
          border-radius: 9px;
        }

        .review-table table {
          min-width: 1050px;
        }

        .review-table thead th {
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          white-space: nowrap;
          border-bottom: 1px solid #e2e8f0;
        }

        .review-table tbody td {
          padding-top: 15px;
          padding-bottom: 15px;
          border-color: #f1f5f9;
        }

        .review-table tbody tr:hover td {
          background: #f8fafc;
        }

        .review-page .pagination .page-link {
          color: #0f766e;
          border-radius: 6px;
          margin: 0 2px;
        }

        .review-page .pagination .page-item.active .page-link {
          background: #0f766e;
          border-color: #0f766e;
          color: white;
        }
      `}</style>
    </Container>
  )
}

export default ReviewList
