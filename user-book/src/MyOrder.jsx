import { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Table, Alert, Spinner, Badge, Card } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

function MyOrder () {
  const [myOrders, setMyOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyOrders = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn')

      if (!isLoggedIn) {
        setError('Please login to view your orders.')
        setLoading(false)
        return
      }

      const email = localStorage.getItem('email')

      if (!email) {
        setError('User email not found. Please login again.')
        setLoading(false)
        return
      }

      try {
        const res = await axios.post(`${apiUrl}/my/orders`, {
          email: email
        })

        setMyOrders(Array.isArray(res.data.data) ? res.data.data : [])
      } catch (err) {
        console.error('Error fetching orders:', err)

        setError(
          err.response?.data?.message ||
            'Unable to fetch your orders. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchMyOrders()
  }, [])

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

          {/* Loading */}
          {loading && (
            <div className='text-center py-5'>
              <Spinner animation='border' variant='primary' />
              <p className='mt-2'>Loading your orders...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && <Alert variant='warning'>{error}</Alert>}

          {/* Empty Orders */}
          {!loading && !error && myOrders.length === 0 && (
            <Alert variant='info'>You have not placed any orders yet.</Alert>
          )}

          {/* Orders Table */}
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
                  {myOrders.map((order, index) => (
                    <tr key={order._id || order.transactionId || index}>
                      <td>{index + 1}</td>

                      <td>{order._id || order.transactionId || 'N/A'}</td>

                      <td>
                        {Array.isArray(order.products) &&
                        order.products.length > 0
                          ? order.products.map((product, productIndex) => (
                              <div
                                key={product._id || productIndex}
                                className='mb-2'
                              >
                                <strong>{product.bookTitle || 'Book'}</strong>

                                <br />

                                <small className='text-muted'>
                                  Quantity: {product.quantity || 1}
                                </small>
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

                      <td>
                        {getPaymentBadge(order.paymentStatus || order.status)}
                      </td>
                      <td>{order.transactionId}</td>

                      <td>{getOrderBadge(order.orderStatus)}</td>

                      <td>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              'en-IN'
                            )
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default MyOrder
