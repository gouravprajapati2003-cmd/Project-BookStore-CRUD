import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Container,
  Table,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Pagination,
  Spinner,
  Alert,
  Button
} from 'react-bootstrap'

import {
  FaSearch,
  FaExchangeAlt,
  FaReceipt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaRupeeSign,
  FaSyncAlt
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function TransactionList () {
  const [transactions, setTransactions] = useState([])
  const [searchTransaction, setSearchTransaction] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [transactionsPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch Transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await axios.get(`${apiUrl}/transactions`)
      setTransactions(res.data.data || [])
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Transactions load nahi ho sake.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Normalize Status
  const normalizeStatus = status => {
    const value = String(status || 'Pending').toLowerCase()

    if (['success', 'completed'].includes(value)) {
      return 'completed'
    }

    if (value === 'failed') {
      return 'failed'
    }

    return 'pending'
  }

  // Search Transactions
  const filteredTransactions = transactions.filter(transaction => {
    const search = searchTransaction.toLowerCase().trim()

    const products = Array.isArray(transaction.products)
      ? transaction.products
      : []

    return (
      transaction.transactionId?.toLowerCase().includes(search) ||
      transaction.email?.toLowerCase().includes(search) ||
      String(transaction.amount ?? '').includes(search) ||
      transaction.status?.toLowerCase().includes(search) ||
      products.some(product =>
        product.bookTitle?.toLowerCase().includes(search)
      )
    )
  })

  // Summary Counts
  const completedCount = transactions.filter(
    t => normalizeStatus(t.status) === 'completed'
  ).length

  const failedCount = transactions.filter(
    t => normalizeStatus(t.status) === 'failed'
  ).length

  const pendingCount = transactions.filter(
    t => normalizeStatus(t.status) === 'pending'
  ).length

  // Pagination
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  )

  const startIndex = (pageNo - 1) * transactionsPerPage

  const currentTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + transactionsPerPage
  )

  const handleSearch = value => {
    setSearchTransaction(value)
    setPageNo(1)
  }

  // Status Details
  const getStatus = status => {
    const value = normalizeStatus(status)

    if (value === 'completed') {
      return {
        label: 'Completed',
        color: '#047857',
        background: '#ecfdf5',
        border: '#a7f3d0',
        icon: <FaCheckCircle />
      }
    }

    if (value === 'failed') {
      return {
        label: 'Failed',
        color: '#be123c',
        background: '#fff1f2',
        border: '#fecdd3',
        icon: <FaTimesCircle />
      }
    }

    return {
      label: 'Pending',
      color: '#a16207',
      background: '#fffbeb',
      border: '#fde68a',
      icon: <FaClock />
    }
  }

  // Format Amount
  const formatAmount = amount => {
    return Number(amount || 0).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    })
  }

  return (
    <Container
      fluid
      className='transaction-page p-3 p-md-4'
      style={{
        background: '#f5f7fb',
        minHeight: '100vh'
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
                background: '#ccfbf1',
                color: '#0f766e'
              }}
            >
              <FaExchangeAlt size={22} />
            </div>

            <div>
              <h4 className='fw-bold mb-1' style={{ color: '#172554' }}>
                Transactions
              </h4>

              <small className='text-secondary'>
                Manage and monitor bookstore payment records
              </small>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className='d-flex justify-content-md-end gap-2'>
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
                placeholder='Search Transactions...'
                value={searchTransaction}
                onChange={e => handleSearch(e.target.value)}
                className='border-start-0 shadow-none'
                style={{
                  borderRadius: '0 8px 8px 0',
                  minHeight: '42px'
                }}
              />
            </InputGroup>

            <Button
              title='Refresh Transactions'
              onClick={fetchTransactions}
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

      {/* Summary Cards */}
      <Row className='g-3 mb-4'>
        {/* Total */}
        <Col sm={6} xl={3}>
          <Card className='border-0 shadow-sm h-100 summary-card'>
            <Card.Body className='p-3'>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <small className='text-secondary fw-semibold'>
                    Total Transactions
                  </small>

                  <h3
                    className='fw-bold mb-0 mt-2'
                    style={{ color: '#1d4ed8' }}
                  >
                    {loading ? '—' : transactions.length}
                  </h3>
                </div>

                <div
                  className='summary-icon'
                  style={{
                    background: '#eff6ff',
                    color: '#2563eb'
                  }}
                >
                  <FaReceipt size={21} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Completed */}
        <Col sm={6} xl={3}>
          <Card className='border-0 shadow-sm h-100 summary-card'>
            <Card.Body className='p-3'>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <small className='text-secondary fw-semibold'>
                    Completed
                  </small>

                  <h3 className='fw-bold mb-0 mt-2 text-success'>
                    {loading ? '—' : completedCount}
                  </h3>
                </div>

                <div
                  className='summary-icon'
                  style={{
                    background: '#ecfdf5',
                    color: '#059669'
                  }}
                >
                  <FaCheckCircle size={21} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Pending */}
        <Col sm={6} xl={3}>
          <Card className='border-0 shadow-sm h-100 summary-card'>
            <Card.Body className='p-3'>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <small className='text-secondary fw-semibold'>Pending</small>

                  <h3
                    className='fw-bold mb-0 mt-2'
                    style={{ color: '#d97706' }}
                  >
                    {loading ? '—' : pendingCount}
                  </h3>
                </div>

                <div
                  className='summary-icon'
                  style={{
                    background: '#fffbeb',
                    color: '#d97706'
                  }}
                >
                  <FaClock size={21} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Failed */}
        <Col sm={6} xl={3}>
          <Card className='border-0 shadow-sm h-100 summary-card'>
            <Card.Body className='p-3'>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <small className='text-secondary fw-semibold'>Failed</small>

                  <h3 className='fw-bold mb-0 mt-2 text-danger'>
                    {loading ? '—' : failedCount}
                  </h3>
                </div>

                <div
                  className='summary-icon'
                  style={{
                    background: '#fff1f2',
                    color: '#e11d48'
                  }}
                >
                  <FaTimesCircle size={21} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transaction Table Card */}
      <Card
        className='border-0 shadow-sm'
        style={{
          borderRadius: '13px',
          overflow: 'hidden'
        }}
      >
        <Card.Body className='p-3 p-md-4'>
          {/* Table Header */}
          <div className='d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4'>
            <div>
              <h6 className='fw-bold mb-1' style={{ color: '#1e293b' }}>
                Payment History
              </h6>

              <small className='text-secondary'>
                All bookstore transactions and payment details
              </small>
            </div>

            <div
              className='px-3 py-2'
              style={{
                background: '#f0fdfa',
                color: '#0f766e',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              {filteredTransactions.length} Records
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant='danger' dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Table */}
          <div className='table-responsive transaction-table'>
            <Table hover className='align-middle mb-0'>
              <thead>
                <tr>
                  <th className='py-3 px-3'>TRANSACTION ID</th>
                  <th className='py-3'>CUSTOMER EMAIL</th>
                  <th className='py-3'>PRODUCTS</th>
                  <th className='py-3'>AMOUNT</th>
                  <th className='py-3'>PAYMENT STATUS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='5' className='text-center py-5'>
                      <Spinner animation='border' variant='success' />

                      <p className='text-secondary mt-2 mb-0'>
                        Loading transactions...
                      </p>
                    </td>
                  </tr>
                ) : currentTransactions.length > 0 ? (
                  currentTransactions.map((transaction, index) => {
                    const products = Array.isArray(transaction.products)
                      ? transaction.products
                      : []

                    const status = getStatus(transaction.status)

                    return (
                      <tr
                        key={
                          transaction._id || transaction.transactionId || index
                        }
                      >
                        {/* Transaction ID */}
                        <td className='px-3'>
                          <div className='d-flex align-items-center gap-2'>
                            <div
                              className='d-flex align-items-center justify-content-center flex-shrink-0'
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '9px',
                                background: '#f1f5f9',
                                color: '#64748b'
                              }}
                            >
                              <FaReceipt size={15} />
                            </div>

                            <span
                              className='fw-semibold'
                              style={{
                                color: '#334155',
                                fontSize: '13px'
                              }}
                            >
                              {transaction.transactionId || 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Customer Email */}
                        <td>
                          <span
                            style={{
                              color: '#64748b',
                              fontSize: '13px'
                            }}
                          >
                            {transaction.email || 'N/A'}
                          </span>
                        </td>

                        {/* Products */}
                        <td>
                          {products.length > 0 ? (
                            <div className='d-flex flex-column gap-2'>
                              {products.map((product, i) => (
                                <div
                                  key={product._id || i}
                                  className='d-flex align-items-center flex-wrap gap-2'
                                >
                                  <span
                                    className='fw-semibold'
                                    style={{
                                      color: '#334155',
                                      fontSize: '13px'
                                    }}
                                  >
                                    {product.bookTitle || 'Unknown Book'}
                                  </span>

                                  <span
                                    className='badge'
                                    style={{
                                      background: '#f1f5f9',
                                      color: '#475569',
                                      fontWeight: '600'
                                    }}
                                  >
                                    × {product.quantity || 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className='text-secondary small'>
                              No products found
                            </span>
                          )}
                        </td>

                        {/* Amount */}
                        <td>
                          <span
                            className='fw-bold'
                            style={{
                              color: '#0f766e',
                              fontSize: '14px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {formatAmount(transaction.amount)}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className='d-inline-flex align-items-center gap-2'
                            style={{
                              padding: '7px 12px',
                              borderRadius: '7px',
                              background: status.background,
                              color: status.color,
                              border: `1px solid ${status.border}`,
                              fontSize: '12px',
                              fontWeight: '600',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan='5' className='text-center py-5'>
                      <div
                        className='d-flex align-items-center justify-content-center mx-auto mb-3'
                        style={{
                          width: '60px',
                          height: '60px',
                          background: '#f1f5f9',
                          borderRadius: '50%',
                          color: '#94a3b8'
                        }}
                      >
                        <FaExchangeAlt size={25} />
                      </div>

                      <h6 className='fw-bold text-secondary mb-1'>
                        No Transactions Found
                      </h6>

                      <small className='text-secondary'>
                        {searchTransaction
                          ? 'Try searching with another keyword.'
                          : 'Transaction records will appear here.'}
                      </small>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && filteredTransactions.length > 0 && (
            <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4'>
              <small className='text-secondary'>
                Showing {startIndex + 1} to{' '}
                {Math.min(
                  startIndex + transactionsPerPage,
                  filteredTransactions.length
                )}{' '}
                of {filteredTransactions.length} transactions
              </small>

              {totalPages > 1 && (
                <Pagination size='sm' className='mb-0'>
                  <Pagination.Prev
                    disabled={pageNo === 1}
                    onClick={() => setPageNo(prev => prev - 1)}
                  />

                  {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={pageNo === index + 1}
                      onClick={() => setPageNo(index + 1)}
                    >
                      {index + 1}
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
        .transaction-page .summary-card {
          border-radius: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .transaction-page .summary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08) !important;
        }

        .transaction-page .summary-icon {
          width: 46px;
          height: 46px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .transaction-table {
          border: 1px solid #e2e8f0;
          border-radius: 9px;
        }

        .transaction-table table {
          min-width: 850px;
        }

        .transaction-table thead th {
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          white-space: nowrap;
          border-bottom: 1px solid #e2e8f0;
        }

        .transaction-table tbody td {
          padding-top: 15px;
          padding-bottom: 15px;
          border-color: #f1f5f9;
        }

        .transaction-table tbody tr:hover td {
          background: #f8fafc;
        }

        .transaction-page .pagination .page-link {
          color: #0f766e;
          border-radius: 6px;
          margin: 0 2px;
        }

        .transaction-page .pagination .page-item.active .page-link {
          background: #0f766e;
          border-color: #0f766e;
          color: white;
        }

        .transaction-page .pagination .page-item.disabled .page-link {
          color: #94a3b8;
        }
      `}</style>
    </Container>
  )
}

export default TransactionList
