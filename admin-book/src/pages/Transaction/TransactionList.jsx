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
  Pagination
} from 'react-bootstrap'
import {
  FaSearch,
  FaExchangeAlt,
  FaReceipt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function TransactionList () {
  const [transactions, setTransactions] = useState([])
  const [searchTransaction, setSearchTransaction] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [transactionsPerPage] = useState(5)

  useEffect(() => {
    axios({
      url: apiUrl + '/transactions',
      method: 'get'
    })
      .then(res => {
        setTransactions(res.data.data || [])
      })
      .catch(err => {
        console.error(err)
        alert('Transactions load nahi ho sake.')
      })
  }, [])

  const filteredTransactions = transactions.filter(transaction => {
    const search = searchTransaction.toLowerCase()

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

  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  )

  const startIndex = (pageNo - 1) * transactionsPerPage

  const currentTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + transactionsPerPage
  )

  const getStatus = status => {
    const value = String(status || 'Pending').toLowerCase()

    if (['success', 'completed'].includes(value)) {
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

  const formatAmount = amount => {
    return Number(amount || 0).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    })
  }

  const handleSearch = value => {
    setSearchTransaction(value)
    setPageNo(1)
  }

  let paginationItems = []

  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={pageNo === i}
        onClick={() => setPageNo(i)}
      >
        {i}
      </Pagination.Item>
    )
  }

  return (
    <Container
      fluid
      className='py-3 px-3 px-md-4'
      style={{
        background: '#f4f6fa',
        minHeight: '100vh'
      }}
    >
      <Card
        className='border-0 shadow-sm'
        style={{
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <Card.Body className='p-3 p-md-4'>
          <Row className='align-items-center mb-4 gy-3'>
            <Col md={6}>
              <div className='d-flex align-items-center gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center'
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: '#eef2ff',
                    color: '#4338ca'
                  }}
                >
                  <FaExchangeAlt size={22} />
                </div>

                <div>
                  <h4 className='fw-bold mb-1' style={{ color: '#172554' }}>
                    Transactions
                  </h4>
                  <small className='text-secondary'>
                    Manage and monitor payment records
                  </small>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className='d-flex justify-content-md-end'>
                <InputGroup size='sm' style={{ maxWidth: '270px' }}>
                  <InputGroup.Text
                    className='bg-white border-end-0'
                    style={{ borderRadius: '8px 0 0 8px' }}
                  >
                    <FaSearch className='text-secondary' />
                  </InputGroup.Text>

                  <Form.Control
                    placeholder='Search transactions...'
                    value={searchTransaction}
                    onChange={e => handleSearch(e.target.value)}
                    className='border-start-0 shadow-none'
                    style={{ borderRadius: '0 8px 8px 0' }}
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>

          <div
            className='d-flex justify-content-between align-items-center mb-3 p-3'
            style={{
              background: '#f8fafc',
              borderRadius: '10px'
            }}
          >
            <div>
              <h6 className='fw-bold mb-1' style={{ color: '#1e293b' }}>
                Payment History
              </h6>
              <small className='text-secondary'>
                All bookstore transactions
              </small>
            </div>

            <div className='text-end'>
              <h5 className='fw-bold mb-0' style={{ color: '#2563eb' }}>
                {filteredTransactions.length}
              </h5>
              <small className='text-secondary'>Total Records</small>
            </div>
          </div>

          <div className='table-responsive'>
            <Table
              hover
              className='align-middle mb-0'
              style={{ minWidth: '750px' }}
            >
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th className='py-3 px-3 text-secondary small'>
                    TRANSACTION ID
                  </th>
                  <th className='py-3 text-secondary small'>CUSTOMER EMAIL</th>
                  <th className='py-3 text-secondary small'>PRODUCTS</th>
                  <th className='py-3 text-secondary small'>AMOUNT</th>
                  <th className='py-3 text-secondary small'>PAYMENT STATUS</th>
                </tr>
              </thead>

              <tbody>
                {currentTransactions.length > 0 ? (
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
                        <td className='px-3'>
                          <div className='d-flex align-items-center gap-2'>
                            <div
                              className='d-flex align-items-center justify-content-center'
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '9px',
                                background: '#f1f5f9',
                                color: '#64748b'
                              }}
                            >
                              <FaReceipt size={14} />
                            </div>

                            <span
                              className='fw-semibold'
                              style={{ color: '#334155', fontSize: '13px' }}
                            >
                              {transaction.transactionId || 'N/A'}
                            </span>
                          </div>
                        </td>

                        <td style={{ color: '#64748b', fontSize: '13px' }}>
                          {transaction.email || 'N/A'}
                        </td>

                        <td>
                          {products.length > 0 ? (
                            <div className='d-flex flex-column gap-2'>
                              {products.map((product, i) => (
                                <div key={product._id || i}>
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
                                    className='ms-2'
                                    style={{
                                      color: '#64748b',
                                      fontSize: '12px'
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

                        <td>
                          <span
                            className='fw-bold'
                            style={{ color: '#0f766e', fontSize: '14px' }}
                          >
                            {formatAmount(transaction.amount)}
                          </span>
                        </td>

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
                      <FaExchangeAlt
                        size={32}
                        className='text-secondary mb-3'
                      />
                      <h6 className='fw-semibold text-secondary'>
                        No Transactions Found
                      </h6>
                      <small className='text-secondary'>
                        Try searching with another keyword.
                      </small>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 0 && (
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

                  {paginationItems}

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
    </Container>
  )
}

export default TransactionList
