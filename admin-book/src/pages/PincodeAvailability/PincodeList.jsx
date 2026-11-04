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
  Pagination
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function PincodeList () {
  const navigate = useNavigate()

  const [pincodes, setPincodes] = useState([])
  const [searchPincode, setSearchPincode] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [pincodesPerPage] = useState(5)

  const goToAddPincode = () => {
    navigate('/add/pincode')
  }

  useEffect(() => {
    axios({
      url: `${apiUrl}/pincodes`,
      method: 'get'
    })
      .then(res => {
        setPincodes(res.data.data || [])
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Unable to fetch pincodes')
      })
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
      className='py-3 px-3 px-md-4'
      style={{ background: '#f5f7fb', minHeight: '100vh' }}
    >
      <Card className='border-0 shadow-sm' style={{ borderRadius: '14px' }}>
        <Card.Body className='p-3 p-md-4'>
          <Row className='align-items-center mb-4 gy-3'>
            <Col md={6}>
              <div className='d-flex align-items-center gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center'
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#dbeafe',
                    color: '#1d4ed8'
                  }}
                >
                  <FaMapMarkerAlt size={21} />
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
                <InputGroup size='sm' style={{ maxWidth: '220px' }}>
                  <InputGroup.Text className='bg-white border-end-0'>
                    <FaSearch className='text-secondary' />
                  </InputGroup.Text>

                  <Form.Control
                    type='text'
                    placeholder='Search pincode...'
                    value={searchPincode}
                    maxLength={6}
                    onChange={e => handleSearch(e.target.value)}
                    className='border-start-0 shadow-none'
                  />
                </InputGroup>

                <Button
                  variant='primary'
                  size='sm'
                  className='d-flex align-items-center gap-2 px-3'
                  style={{ background: '#2563eb', border: 'none' }}
                  onClick={goToAddPincode}
                >
                  <FaPlus size={11} />
                  Add Pincode
                </Button>
              </div>
            </Col>
          </Row>

          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h6 className='fw-bold mb-0' style={{ color: '#334155' }}>
              Pincode Collection
            </h6>

            <small className='text-secondary'>
              {filteredPincodes.length} pincodes found
            </small>
          </div>

          <div className='table-responsive'>
            <Table hover className='align-middle mb-0'>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
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
                {currentPincodes.length > 0 ? (
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
                          className='fw-semibold'
                          style={{
                            color: '#1d4ed8',
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
                            padding: '7px 11px'
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
                            className='text-warning border'
                            title='Edit Pincode'
                            onClick={() => goForEdit(p._id)}
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
                      <FaMapMarkerAlt
                        size={30}
                        className='text-secondary mb-3'
                      />
                      <p className='text-secondary mb-0'>No Pincode Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 0 && (
            <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4'>
              <small className='text-secondary'>
                Showing {startIndex + 1} to{' '}
                {Math.min(
                  startIndex + pincodesPerPage,
                  filteredPincodes.length
                )}{' '}
                of {filteredPincodes.length} pincodes
              </small>

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
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default PincodeList
