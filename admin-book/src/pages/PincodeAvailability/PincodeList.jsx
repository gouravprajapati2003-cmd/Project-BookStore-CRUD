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
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaList
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function PincodeList () {
  const navigate = useNavigate()

  const [pincodes, setPincodes] = useState([])
  const [searchPincode, setSearchPincode] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [pincodesPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const goToAddPincode = () => {
    navigate('/add/pincode')
  }

  const fetchPincodes = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await axios.get(`${apiUrl}/pincodes`)
      setPincodes(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch pincodes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPincodes()
  }, [])

  const goForEdit = id => {
    navigate('/edit/pincode/' + id)
  }

  const filteredPincodes = pincodes.filter(p =>
    String(p.pinCode || '').includes(searchPincode)
  )

  const totalPages = Math.ceil(filteredPincodes.length / pincodesPerPage)

  const startIndex = (pageNo - 1) * pincodesPerPage

  const currentPincodes = filteredPincodes.slice(
    startIndex,
    startIndex + pincodesPerPage
  )

  const availableCount = pincodes.filter(p => p.isAvailable).length
  const unavailableCount = pincodes.length - availableCount

  const handleSearch = value => {
    setSearchPincode(value.replace(/\D/g, '').slice(0, 6))
    setPageNo(1)
  }

  const formatDate = date => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    })
  }

  return (
    <Container
      fluid
      className='p-3 p-md-4'
      style={{ background: '#f5f7fb', minHeight: '100%' }}
    >
      <Card className='border-0 shadow-sm' style={{ borderRadius: '14px' }}>
        <Card.Body className='p-3 p-md-4'>
          {/* Header */}
          <Row className='align-items-center mb-4 gy-3'>
            <Col md={6}>
              <div className='d-flex align-items-center gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center flex-shrink-0'
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#ccfbf1',
                    color: '#0f766e'
                  }}
                >
                  <FaMapMarkerAlt size={22} />
                </div>

                <div>
                  <h4 className='mb-1 fw-bold' style={{ color: '#172554' }}>
                    Manage Availability
                  </h4>

                  <small className='text-secondary'>
                    Manage book delivery pincodes and availability
                  </small>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className='d-flex align-items-center justify-content-md-end gap-2 flex-wrap'>
                <InputGroup style={{ maxWidth: '230px', minWidth: '160px' }}>
                  <InputGroup.Text className='bg-white border-end-0'>
                    <FaSearch className='text-secondary' />
                  </InputGroup.Text>

                  <Form.Control
                    type='text'
                    placeholder='Search Pincode...'
                    value={searchPincode}
                    maxLength={6}
                    onChange={e => handleSearch(e.target.value)}
                    className='border-start-0 shadow-none'
                  />
                </InputGroup>

                <Button
                  className='d-flex align-items-center justify-content-center gap-2 px-3 py-2 fw-semibold'
                  style={{
                    background: '#0f766e',
                    border: 'none',
                    minHeight: '42px',
                    borderRadius: '8px'
                  }}
                  onClick={goToAddPincode}
                >
                  <FaPlus size={12} />
                  Add Pincode
                </Button>
              </div>
            </Col>
          </Row>

          {/* Summary Cards */}
          <Row className='g-3 mb-4'>
            <Col sm={6} lg={4}>
              <Card
                className='border-0 h-100'
                style={{
                  background: '#eff6ff',
                  borderRadius: '11px'
                }}
              >
                <Card.Body className='d-flex align-items-center justify-content-between p-3'>
                  <div>
                    <small className='text-secondary fw-semibold'>
                      Total Pincodes
                    </small>
                    <h3
                      className='fw-bold mb-0 mt-1'
                      style={{ color: '#1d4ed8' }}
                    >
                      {pincodes.length}
                    </h3>
                  </div>

                  <FaList size={25} style={{ color: '#2563eb' }} />
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} lg={4}>
              <Card
                className='border-0 h-100'
                style={{
                  background: '#ecfdf5',
                  borderRadius: '11px'
                }}
              >
                <Card.Body className='d-flex align-items-center justify-content-between p-3'>
                  <div>
                    <small className='text-secondary fw-semibold'>
                      Available
                    </small>
                    <h3 className='fw-bold mb-0 mt-1 text-success'>
                      {availableCount}
                    </h3>
                  </div>

                  <FaCheckCircle size={25} className='text-success' />
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} lg={4}>
              <Card
                className='border-0 h-100'
                style={{
                  background: '#fef2f2',
                  borderRadius: '11px'
                }}
              >
                <Card.Body className='d-flex align-items-center justify-content-between p-3'>
                  <div>
                    <small className='text-secondary fw-semibold'>
                      Not Available
                    </small>
                    <h3 className='fw-bold mb-0 mt-1 text-danger'>
                      {unavailableCount}
                    </h3>
                  </div>

                  <FaTimesCircle size={25} className='text-danger' />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Table Heading */}
          <div className='d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2'>
            <div>
              <h6 className='fw-bold mb-1' style={{ color: '#334155' }}>
                Pincode Collection
              </h6>
              <small className='text-secondary'>
                Delivery availability records
              </small>
            </div>

            <small className='text-secondary'>
              {filteredPincodes.length} records found
            </small>
          </div>

          {/* Error */}
          {error && (
            <Alert variant='danger' dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Table */}
          <div className='table-responsive' style={{ minHeight: '250px' }}>
            <Table hover className='align-middle mb-0'>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th className='py-3 px-3 text-secondary small'>BOOK NAME</th>
                  <th className='py-3 text-secondary small'>PINCODE</th>
                  <th className='py-3 text-secondary small'>AVAILABILITY</th>
                  <th className='py-3 text-secondary small'>CREATED DATE</th>
                  <th className='py-3 text-center text-secondary small'>
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='5' className='text-center py-5'>
                      <Spinner animation='border' variant='success' />
                      <p className='text-secondary mt-2 mb-0'>
                        Loading pincodes...
                      </p>
                    </td>
                  </tr>
                ) : currentPincodes.length > 0 ? (
                  currentPincodes.map(p => (
                    <tr key={p._id}>
                      <td className='px-3'>
                        <span
                          className='fw-semibold'
                          style={{ color: '#1e293b' }}
                        >
                          {p.book?.bookTittle || 'N/A'}
                        </span>
                      </td>

                      <td>
                        <span
                          className='fw-bold'
                          style={{
                            color: '#0f766e',
                            letterSpacing: '1px'
                          }}
                        >
                          {p.pinCode}
                        </span>
                      </td>

                      <td>
                        <span
                          className='badge rounded-pill d-inline-flex align-items-center gap-1'
                          style={{
                            background: p.isAvailable ? '#dcfce7' : '#fee2e2',
                            color: p.isAvailable ? '#15803d' : '#b91c1c',
                            padding: '7px 11px',
                            fontWeight: '600'
                          }}
                        >
                          {p.isAvailable ? (
                            <FaCheckCircle size={11} />
                          ) : (
                            <FaTimesCircle size={11} />
                          )}

                          {p.isAvailable ? 'Available' : 'Not Available'}
                        </span>
                      </td>

                      <td className='text-secondary'>
                        {formatDate(p.createdAt)}
                      </td>

                      <td>
                        <div className='d-flex justify-content-center'>
                          <Button
                            variant='light'
                            size='sm'
                            title='Edit Pincode'
                            onClick={() => goForEdit(p._id)}
                            style={{
                              color: '#0f766e',
                              border: '1px solid #99f6e4',
                              background: '#f0fdfa',
                              borderRadius: '7px'
                            }}
                          >
                            <FaEdit />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='5' className='text-center py-5'>
                      <FaTruck size={30} className='text-secondary mb-3' />

                      <p className='fw-semibold text-secondary mb-1'>
                        No Pincode Found
                      </p>

                      <small className='text-secondary'>
                        {searchPincode
                          ? 'Try searching with another pincode.'
                          : 'Add a pincode to manage delivery availability.'}
                      </small>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 0 && (
            <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4'>
              <small className='text-secondary'>
                Showing {startIndex + 1} to{' '}
                {Math.min(
                  startIndex + pincodesPerPage,
                  filteredPincodes.length
                )}{' '}
                of {filteredPincodes.length} pincodes
              </small>

              {totalPages > 1 && (
                <Pagination size='sm' className='mb-0'>
                  <Pagination.Prev
                    disabled={pageNo === 1}
                    onClick={() => setPageNo(pageNo - 1)}
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
                    onClick={() => setPageNo(pageNo + 1)}
                  />
                </Pagination>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      <style>{`
        .table thead th {
          font-weight: 600;
          white-space: nowrap;
          border-bottom: 1px solid #e2e8f0;
        }

        .table tbody td {
          padding-top: 14px;
          padding-bottom: 14px;
          border-color: #f1f5f9;
        }

        .table tbody tr:hover {
          background-color: #f8fafc;
        }

        .pagination .page-link {
          color: #0f766e;
          border-radius: 6px;
          margin: 0 2px;
        }

        .pagination .page-item.active .page-link {
          background-color: #0f766e;
          border-color: #0f766e;
          color: white;
        }

        @media (max-width: 576px) {
          .table {
            min-width: 700px;
          }
        }
      `}</style>
    </Container>
  )
}

export default PincodeList
