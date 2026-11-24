import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  Container,
  Table,
  Alert,
  Spinner,
  Badge,
  Card,
  Button,
  Modal,
  Form
} from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

// Get logged-in user ID from JWT
const getCurrentUserId = token => {
  try {
    if (!token) return null

    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')

    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

    const payload = JSON.parse(atob(paddedBase64))

    return payload._id || payload.id || null
  } catch {
    return null
  }
}

function MyOrder () {
  const [myOrders, setMyOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')

  const userToken = localStorage.getItem('userToken')
  const currentUserId = getCurrentUserId(userToken)

  // Fetch orders and existing reviews
  const fetchMyOrders = useCallback(async () => {
    if (!userToken) {
      setError('Please login to view your orders.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const res = await axios.post(
        `${apiUrl}/my/orders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )

      const orders = Array.isArray(res.data.data) ? res.data.data : []

      // Collect unique purchased book IDs
      const bookIds = [
        ...new Set(
          orders.flatMap(order =>
            (Array.isArray(order.products) ? order.products : [])
              .map(product => {
                const id = product.bookId?._id || product.bookId
                return id ? String(id) : null
              })
              .filter(Boolean)
          )
        )
      ]

      // Fetch reviews for purchased books
      const reviewResults = await Promise.all(
        bookIds.map(async bookId => {
          try {
            const reviewRes = await axios.get(
              `${apiUrl}/user/book/${bookId}/reviews`
            )

            const reviews = reviewRes.data.reviews || []

            const ownReview = reviews.find(review => {
              const reviewUserId = review.userId?._id || review.userId

              return (
                currentUserId && String(reviewUserId) === String(currentUserId)
              )
            })

            return [bookId, ownReview || null]
          } catch (err) {
            console.error(`Review fetch error for book ${bookId}:`, err)
            return [bookId, null]
          }
        })
      )

      const reviewMap = Object.fromEntries(reviewResults)

      // Attach user's review to each purchased product
      const updatedOrders = orders.map(order => ({
        ...order,
        products: (Array.isArray(order.products) ? order.products : []).map(
          product => {
            const bookId = product.bookId?._id || product.bookId

            return {
              ...product,
              userReview: bookId ? reviewMap[String(bookId)] || null : null
            }
          }
        )
      }))

      setMyOrders(updatedOrders)
    } catch (err) {
      console.error('Error fetching orders:', err)

      setError(
        err.response?.data?.message ||
          'Unable to fetch your orders. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [userToken, currentUserId])

  useEffect(() => {
    fetchMyOrders()
  }, [fetchMyOrders])

  // Open Write/Edit Review Modal
  const openReviewModal = (product, order) => {
    const bookId = product.bookId?._id || product.bookId

    if (!bookId) {
      setReviewMessage('Book information is unavailable.')
      return
    }

    setSelectedBook({
      ...product,
      bookId,
      orderId: order._id
    })

    setRating(product.userReview?.rating || 5)
    setTitle(product.userReview?.title || '')
    setComment(product.userReview?.comment || '')
    setReviewMessage('')
    setShowReviewModal(true)
  }

  // Submit or Update Review
  const submitReview = async e => {
    e.preventDefault()
    setReviewMessage('')

    if (!userToken) {
      setReviewMessage('Please login first.')
      return
    }

    if (!selectedBook?.bookId) {
      setReviewMessage('Book information is unavailable.')
      return
    }

    if (!title.trim() || !comment.trim()) {
      setReviewMessage('Please enter review title and comment.')
      return
    }

    try {
      setSubmitting(true)

      const res = await axios.post(
        `${apiUrl}/user/book/${selectedBook.bookId}/review`,
        {
          rating,
          title: title.trim(),
          comment: comment.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )

      setReviewMessage(res.data.message || 'Review saved successfully.')

      await fetchMyOrders()

      setShowReviewModal(false)
      setSelectedBook(null)
      setTitle('')
      setComment('')
      setRating(5)
    } catch (err) {
      setReviewMessage(
        err.response?.data?.message || 'Unable to submit review.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const getPaymentBadge = status => {
    const value = String(status || '').toLowerCase()

    if (value === 'paid' || value === 'success' || value === 'captured') {
      return <Badge bg='success'>{status}</Badge>
    }

    if (value === 'failed') {
      return <Badge bg='danger'>{status}</Badge>
    }

    return (
      <Badge bg='warning' text='dark'>
        {status || 'Pending'}
      </Badge>
    )
  }

  const getOrderBadge = status => {
    const value = String(status || '').toLowerCase()

    if (value === 'delivered') {
      return <Badge bg='success'>{status}</Badge>
    }

    if (value === 'cancelled') {
      return <Badge bg='danger'>{status}</Badge>
    }

    return <Badge bg='info'>{status || 'Processing'}</Badge>
  }

  return (
    <Container className='py-4'>
      <Card className='shadow-sm border-0'>
        <Card.Body>
          <h2 className='mb-4'>
            <i className='bi bi-bag-check me-2'></i>
            My Orders
          </h2>

          {loading && (
            <div className='text-center py-5'>
              <Spinner animation='border' variant='primary' />
              <p className='mt-2'>Loading your orders...</p>
            </div>
          )}

          {!loading && error && <Alert variant='warning'>{error}</Alert>}

          {!loading && !error && myOrders.length === 0 && (
            <Alert variant='info'>You have not placed any orders yet.</Alert>
          )}

          {!loading && !error && myOrders.length > 0 && (
            <div className='table-responsive'>
              <Table
                striped
                bordered
                hover
                responsive='md'
                className='align-middle'
              >
                <thead className='table-dark'>
                  <tr>
                    <th>S.No.</th>
                    <th>Order ID</th>
                    <th>Book Details</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                    <th>Transaction Id</th>
                    <th>Order Status</th>
                    <th>Order Date</th>
                  </tr>
                </thead>

                <tbody>
                  {myOrders.map((order, index) => {
                    const paymentStatus = order.paymentStatus || order.status

                    const isPaymentSuccess =
                      String(paymentStatus || '').toLowerCase() === 'success' ||
                      String(paymentStatus || '').toLowerCase() === 'paid' ||
                      String(paymentStatus || '').toLowerCase() === 'captured'

                    return (
                      <tr key={order._id || order.transactionId || index}>
                        <td>{index + 1}</td>

                        <td>{order._id || order.transactionId || 'N/A'}</td>

                        <td>
                          {Array.isArray(order.products) &&
                          order.products.length > 0
                            ? order.products.map((product, productIndex) => (
                                <div
                                  key={
                                    product.bookId?._id ||
                                    product.bookId ||
                                    productIndex
                                  }
                                  className='mb-3'
                                >
                                  <strong>
                                    {product.bookTitle ||
                                      product.bookTittle ||
                                      'Book'}
                                  </strong>

                                  <br />

                                  <small className='text-muted'>
                                    Quantity: {product.quantity || 1}
                                  </small>

                                  {isPaymentSuccess && (
                                    <div className='mt-2'>
                                      <Button
                                        size='sm'
                                        variant={
                                          product.userReview
                                            ? 'outline-primary'
                                            : 'outline-success'
                                        }
                                        onClick={() =>
                                          openReviewModal(product, order)
                                        }
                                      >
                                        <i
                                          className={`bi ${
                                            product.userReview
                                              ? 'bi-pencil-square'
                                              : 'bi-star'
                                          } me-1`}
                                        />

                                        {product.userReview
                                          ? 'Edit Review'
                                          : 'Write Review'}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))
                            : 'N/A'}
                        </td>

                        <td>
                          ₹
                          {Number(
                            order.amount ??
                              order.totalCost ??
                              order.totalAmount ??
                              0
                          ).toLocaleString('en-IN')}
                        </td>

                        <td>{getPaymentBadge(paymentStatus)}</td>

                        <td>{order.transactionId || 'N/A'}</td>

                        <td>{getOrderBadge(order.orderStatus)}</td>

                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                'en-IN'
                              )
                            : 'N/A'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Write / Edit Review Modal */}
      <Modal
        show={showReviewModal}
        onHide={() => {
          if (!submitting) {
            setShowReviewModal(false)
            setSelectedBook(null)
          }
        }}
        centered
      >
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>
            {selectedBook?.userReview ? 'Edit Review' : 'Write a Review'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={submitReview}>
          <Modal.Body>
            <div className='mb-3'>
              <h6 className='fw-semibold'>
                {selectedBook?.bookTitle || selectedBook?.bookTittle || 'Book'}
              </h6>

              <small className='text-muted'>
                Share your experience with this book.
              </small>
            </div>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Your Rating</Form.Label>

              <div className='d-flex gap-2'>
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    role='button'
                    onClick={() => setRating(star)}
                    className={`bi ${
                      star <= rating ? 'bi-star-fill' : 'bi-star'
                    }`}
                    style={{
                      color: '#F4B400',
                      fontSize: '28px',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Review Title</Form.Label>

              <Form.Control
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={100}
                placeholder='Summarize your experience'
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Your Review</Form.Label>

              <Form.Control
                as='textarea'
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={2000}
                placeholder='What did you like or dislike about this book?'
                required
              />
            </Form.Group>

            {reviewMessage && (
              <Alert variant='danger' className='mb-0'>
                {reviewMessage}
              </Alert>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant='secondary'
              disabled={submitting}
              onClick={() => {
                setShowReviewModal(false)
                setSelectedBook(null)
              }}
            >
              Cancel
            </Button>

            <Button
              type='submit'
              disabled={submitting}
              className='border-0'
              style={{ background: '#123B4A' }}
            >
              {submitting ? (
                <>
                  <Spinner size='sm' animation='border' className='me-2' />
                  Saving...
                </>
              ) : selectedBook?.userReview ? (
                'Update Review'
              ) : (
                'Submit Review'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default MyOrder
