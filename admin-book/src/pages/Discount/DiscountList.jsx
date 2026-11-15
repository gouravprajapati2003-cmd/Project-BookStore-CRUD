import { useNavigate } from 'react-router-dom'
import {
  Button,
  Col,
  Container,
  Row,
  Table,
  InputGroup,
  Form,
  Card,
  Pagination,
  Spinner,
  Alert
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  FaPercent,
  FaPlus,
  FaSearch,
  FaEdit,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function DiscountList () {
  const navigate = useNavigate()

  const [discounts, setDiscounts] = useState([])
  const [searchDiscount, setSearchDiscount] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [discountsPerPage] = useState(5)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  // Fetch Discounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await axios.get(`${apiUrl}/discounts`)

        setDiscounts(Array.isArray(res.data.data) ? res.data.data : [])
      } catch (err) {
        console.log(err)

        setError(err.response?.data?.message || 'Unable to fetch discounts.')
      } finally {
        setLoading(false)
      }
    }

    fetchDiscounts()
  }, [])

  // Navigate to Add Discount
  const goToAddDiscount = () => {
    navigate('/add/discount')
  }

  // Navigate to Edit Discount
  const goForEdit = id => {
    navigate('/edit/discount/' + id)
  }

  // Toggle Discount Status
  const toggleDiscountStatus = async (id, currentStatus) => {
    try {
      setUpdatingId(id)

      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'

      const res = await axios.put(`${apiUrl}/discount/status/${id}`, {
        status: newStatus
      })

      if (res.data.success) {
        setDiscounts(prev =>
          prev.map(d => (d._id === id ? { ...d, status: newStatus } : d))
        )
      }
    } catch (err) {
      console.log(err)

      setError(err.response?.data?.message || 'Status update failed.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Search
  const handleSearch = value => {
    setSearchDiscount(value)
    setPageNo(1)
  }

  const filteredDiscounts = discounts.filter(d => {
    const search = searchDiscount.toLowerCase().trim()

    return (
      d.discountName?.toLowerCase().includes(search) ||
      d.book?.bookTittle?.toLowerCase().includes(search) ||
      d.discountType?.toLowerCase().includes(search) ||
      d.status?.toLowerCase().includes(search)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredDiscounts.length / discountsPerPage)

  const startIndex = (pageNo - 1) * discountsPerPage

  const currentDiscounts = filteredDiscounts.slice(
    startIndex,
    startIndex + discountsPerPage
  )

  // Date Formatting
  const formatDate = date => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    })
  }

  const activeDiscounts = discounts.filter(d => d.status === 'Active').length

  const inactiveDiscounts = discounts.filter(
    d => d.status === 'Inactive'
  ).length

  return (
    <Container fluid className='discount-list-page'>
      {/* Page Header */}
      <Row className='align-items-center mb-4 gy-3'>
        <Col xs={12} md={7}>
          <div className='d-flex align-items-center gap-3'>
            <div className='page-icon'>
              <FaPercent size={23} />
            </div>

            <div>
              <h3 className='page-title mb-1'>Manage Discounts</h3>

              <p className='page-subtitle mb-0'>
                Create and manage bookstore discounts
              </p>
            </div>
          </div>
        </Col>

        <Col xs={12} md={5}>
          <div className='d-flex justify-content-md-end'>
            <Button className='add-discount-btn' onClick={goToAddDiscount}>
              <FaPlus size={15} />
              Add Discount
            </Button>
          </div>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className='g-3 mb-4'>
        <Col xs={12} sm={4}>
          <Card className='summary-card'>
            <Card.Body>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <p className='summary-label'>Total Discounts</p>
                  <h4 className='summary-value'>{discounts.length}</h4>
                </div>

                <div className='summary-icon total-icon'>
                  <FaPercent />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} sm={4}>
          <Card className='summary-card'>
            <Card.Body>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <p className='summary-label'>Active</p>
                  <h4 className='summary-value text-success'>
                    {activeDiscounts}
                  </h4>
                </div>

                <div className='summary-icon active-icon'>
                  <FaToggleOn />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} sm={4}>
          <Card className='summary-card'>
            <Card.Body>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <p className='summary-label'>Inactive</p>
                  <h4 className='summary-value text-danger'>
                    {inactiveDiscounts}
                  </h4>
                </div>

                <div className='summary-icon inactive-icon'>
                  <FaToggleOff />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Discount Card */}
      <Card className='discount-main-card'>
        <Card.Body className='p-3 p-md-4'>
          {/* Table Header */}
          <Row className='align-items-center mb-4 gy-3'>
            <Col xs={12} md={6}>
              <h5 className='section-title mb-1'>Discount Collection</h5>

              <small className='text-secondary'>
                {filteredDiscounts.length} discounts found
              </small>
            </Col>

            <Col xs={12} md={6}>
              <InputGroup className='discount-search'>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>

                <Form.Control
                  type='text'
                  placeholder='Search discount, book or status...'
                  value={searchDiscount}
                  onChange={e => handleSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          {error && (
            <Alert variant='danger' dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading ? (
            <div className='loading-area'>
              <Spinner animation='border' variant='success' />
              <p className='text-muted mt-2 mb-0'>Loading discounts...</p>
            </div>
          ) : (
            <>
              {/* Discount Table */}
              <div className='table-responsive'>
                <Table hover className='discount-table align-middle mb-0'>
                  <thead>
                    <tr>
                      <th>DISCOUNT NAME</th>
                      <th>TYPE</th>
                      <th>VALUE</th>
                      <th>BOOK NAME</th>
                      <th>VALID FROM</th>
                      <th>VALID UP TO</th>
                      <th>STATUS</th>
                      <th className='text-center'>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentDiscounts.length > 0 ? (
                      currentDiscounts.map(d => (
                        <tr key={d._id}>
                          <td>
                            <span className='discount-name'>
                              {d.discountName}
                            </span>
                          </td>

                          <td>
                            <span className='type-badge'>{d.discountType}</span>
                          </td>

                          <td>
                            <span className='discount-value'>
                              {d.discountType === 'Percentage'
                                ? `${d.discountValue}%`
                                : `₹${d.discountValue}`}
                            </span>
                          </td>

                          <td className='book-name'>
                            {d.book?.bookTittle || 'N/A'}
                          </td>

                          <td className='date-text'>
                            {formatDate(d.validFrom)}
                          </td>

                          <td className='date-text'>{formatDate(d.validTo)}</td>

                          <td>
                            <span
                              className={`status-badge ${
                                d.status === 'Active'
                                  ? 'status-active'
                                  : 'status-inactive'
                              }`}
                            >
                              <span className='status-dot'></span>
                              {d.status || 'N/A'}
                            </span>
                          </td>

                          <td>
                            <div className='d-flex justify-content-center gap-2'>
                              <Button
                                variant='light'
                                size='sm'
                                className='action-btn edit-btn'
                                title='Edit Discount'
                                onClick={() => goForEdit(d._id)}
                              >
                                <FaEdit />
                              </Button>

                              <Button
                                variant='light'
                                size='sm'
                                className={`action-btn ${
                                  d.status === 'Active'
                                    ? 'deactivate-btn'
                                    : 'activate-btn'
                                }`}
                                title={
                                  d.status === 'Active'
                                    ? 'Deactivate Discount'
                                    : 'Activate Discount'
                                }
                                disabled={updatingId === d._id}
                                onClick={() =>
                                  toggleDiscountStatus(d._id, d.status)
                                }
                              >
                                {updatingId === d._id ? (
                                  <Spinner animation='border' size='sm' />
                                ) : d.status === 'Active' ? (
                                  <FaToggleOn size={18} />
                                ) : (
                                  <FaToggleOff size={18} />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='8'>
                          <div className='empty-state'>
                            <FaTag size={35} />
                            <h6>No Discounts Found</h6>
                            <p>No discount records match your search.</p>

                            {searchDiscount && (
                              <Button
                                variant='outline-secondary'
                                size='sm'
                                onClick={() => handleSearch('')}
                              >
                                Clear Search
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4'>
                  <small className='text-secondary'>
                    Showing {startIndex + 1} to{' '}
                    {Math.min(
                      startIndex + discountsPerPage,
                      filteredDiscounts.length
                    )}{' '}
                    of {filteredDiscounts.length} discounts
                  </small>

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
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Styling */}
      <style>{`
        .discount-list-page {
          padding: 5px 0 25px;
        }

        .page-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: #fef3c7;
          color: #b45309;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .page-title {
          color: #172554;
          font-size: 25px;
          font-weight: 700;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 14px;
        }

        /* Add Discount Button */
        .add-discount-btn {
          min-height: 48px;
          padding: 11px 24px;
          border-radius: 9px;
          background: #0f766e;
          border: 1px solid #0f766e;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
          box-shadow: 0 3px 8px rgba(15, 118, 110, 0.18);
          transition: all 0.2s ease;
        }

        .add-discount-btn:hover {
          background: #115e59;
          border-color: #115e59;
          transform: translateY(-1px);
          box-shadow: 0 5px 12px rgba(15, 118, 110, 0.22);
        }

        /* Summary Cards */
        .summary-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.03);
        }

        .summary-card .card-body {
          padding: 17px 20px;
        }

        .summary-label {
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 7px;
        }

        .summary-value {
          color: #172554;
          font-size: 25px;
          font-weight: 700;
          margin-bottom: 0;
        }

        .summary-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 20px;
        }

        .total-icon {
          background: #e0f2fe;
          color: #0369a1;
        }

        .active-icon {
          background: #dcfce7;
          color: #15803d;
        }

        .inactive-icon {
          background: #fee2e2;
          color: #b91c1c;
        }

        /* Main Card */
        .discount-main-card {
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .section-title {
          color: #172554;
          font-size: 17px;
          font-weight: 700;
        }

        /* Search */
        .discount-search {
          max-width: 340px;
          margin-left: auto;
        }

        .discount-search .input-group-text {
          background: white;
          color: #64748b;
          border-right: 0;
          border-color: #cbd5e1;
        }

        .discount-search .form-control {
          border-left: 0;
          border-color: #cbd5e1;
          box-shadow: none;
          min-height: 40px;
          font-size: 13px;
        }

        .discount-search .form-control:focus {
          border-color: #cbd5e1;
        }

        /* Table */
        .discount-table {
          white-space: nowrap;
        }

        .discount-table thead th {
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          padding: 15px 13px;
          border-bottom: 1px solid #e2e8f0;
        }

        .discount-table tbody td {
          padding: 15px 13px;
          font-size: 13px;
          border-bottom-color: #f1f5f9;
        }

        .discount-name {
          color: #1e293b;
          font-weight: 600;
        }

        .type-badge {
          background: #e0f2fe;
          color: #0369a1;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .discount-value {
          color: #15803d;
          font-weight: 700;
        }

        .book-name,
        .date-text {
          color: #64748b;
        }

        /* Status */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-active {
          background: #dcfce7;
          color: #15803d;
        }

        .status-inactive {
          background: #fee2e2;
          color: #b91c1c;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        /* Action Buttons */
        .action-btn {
          width: 33px;
          height: 33px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          background: white;
          transition: all 0.2s ease;
        }

        .edit-btn {
          color: #d97706;
          border: 1px solid #fcd34d;
        }

        .edit-btn:hover {
          background: #fef3c7;
          color: #b45309;
        }

        .deactivate-btn {
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .deactivate-btn:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        .activate-btn {
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .activate-btn:hover {
          background: #dcfce7;
          color: #166534;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 45px 15px;
          color: #94a3b8;
        }

        .empty-state h6 {
          color: #334155;
          margin-top: 14px;
          font-weight: 700;
        }

        .empty-state p {
          font-size: 13px;
          margin-bottom: 15px;
        }

        .loading-area {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Pagination */
        .pagination .page-link {
          color: #0f766e;
          border-radius: 6px;
          margin: 0 2px;
        }

        .pagination .active .page-link {
          background: #0f766e;
          border-color: #0f766e;
          color: white;
        }

        @media (max-width: 767px) {
          .page-title {
            font-size: 21px;
          }

          .add-discount-btn {
            width: 100%;
            min-height: 48px;
          }

          .discount-search {
            max-width: 100%;
          }

          .summary-card .card-body {
            padding: 13px;
          }

          .summary-value {
            font-size: 22px;
          }

          .summary-icon {
            width: 35px;
            height: 35px;
            font-size: 17px;
          }
        }
      `}</style>
    </Container>
  )
}

export default DiscountList
