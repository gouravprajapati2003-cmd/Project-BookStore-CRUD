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
  FaTag,
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

  useEffect(() => {
    axios({
      url: `${apiUrl}/discounts`,
      method: 'get'
    })
      .then(res => {
        setDiscounts(res.data.data || [])
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Unable to fetch discounts')
      })
  }, [])

  const goToAddDiscount = () => {
    navigate('/add/discount')
  }

  const goForEdit = id => {
    navigate('/edit/discount/' + id)
  }

  const toggleDiscountStatus = async (id, currentStatus) => {
    try {
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
      alert(err.response?.data?.message || 'Status update failed')
    }
  }

  const handleSearch = value => {
    setSearchDiscount(value)
    setPageNo(1)
  }

  const filteredDiscounts = discounts.filter(d => {
    const search = searchDiscount.toLowerCase()

    return (
      d.discountName?.toLowerCase().includes(search) ||
      d.book?.bookTittle?.toLowerCase().includes(search) ||
      d.discountType?.toLowerCase().includes(search)
    )
  })

  const totalPages = Math.ceil(filteredDiscounts.length / discountsPerPage)

  const startIndex = (pageNo - 1) * discountsPerPage

  const currentDiscounts = filteredDiscounts.slice(
    startIndex,
    startIndex + discountsPerPage
  )

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
                    background: '#fef3c7',
                    color: '#b45309'
                  }}
                >
                  <FaTag size={21} />
                </div>

                <div>
                  <h4 className='mb-1 fw-bold' style={{ color: '#172554' }}>
                    Manage Discounts
                  </h4>
                  <small className='text-secondary'>
                    Create and manage bookstore discounts
                  </small>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className='d-flex align-items-center justify-content-md-end gap-2 flex-wrap'>
                <InputGroup size='sm' style={{ maxWidth: '240px' }}>
                  <InputGroup.Text className='bg-white border-end-0'>
                    <FaSearch className='text-secondary' />
                  </InputGroup.Text>

                  <Form.Control
                    type='text'
                    placeholder='Search discount...'
                    value={searchDiscount}
                    onChange={e => handleSearch(e.target.value)}
                    className='border-start-0 shadow-none'
                  />
                </InputGroup>

                <Button
                  variant='primary'
                  size='sm'
                  className='d-flex align-items-center gap-2 px-3'
                  style={{ background: '#2563eb', border: 'none' }}
                  onClick={goToAddDiscount}
                >
                  <FaPlus size={11} />
                  Add Discount
                </Button>
              </div>
            </Col>
          </Row>

          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h6 className='fw-bold mb-0' style={{ color: '#334155' }}>
              Discount Collection
            </h6>

            <small className='text-secondary'>
              {filteredDiscounts.length} discounts found
            </small>
          </div>

          <div className='table-responsive'>
            <Table hover className='align-middle mb-0'>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th className='py-3 px-3 text-secondary small'>
                    DISCOUNT NAME
                  </th>
                  <th className='py-3 text-secondary small'>TYPE</th>
                  <th className='py-3 text-secondary small'>VALUE</th>
                  <th className='py-3 text-secondary small'>BOOK NAME</th>
                  <th className='py-3 text-secondary small'>VALID FROM</th>
                  <th className='py-3 text-secondary small'>VALID UP TO</th>
                  <th className='py-3 text-secondary small'>STATUS</th>
                  <th className='py-3 text-center text-secondary small'>
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentDiscounts.length > 0 ? (
                  currentDiscounts.map(d => (
                    <tr key={d._id}>
                      <td className='px-3'>
                        <span
                          className='fw-semibold'
                          style={{ color: '#1e293b' }}
                        >
                          {d.discountName}
                        </span>
                      </td>

                      <td>
                        <span
                          className='badge rounded-pill'
                          style={{
                            background: '#e0f2fe',
                            color: '#0369a1',
                            padding: '7px 11px'
                          }}
                        >
                          {d.discountType}
                        </span>
                      </td>

                      <td className='fw-semibold text-success'>
                        {d.discountType === 'Percentage'
                          ? `${d.discountValue}%`
                          : `₹${d.discountValue}`}
                      </td>

                      <td className='text-secondary'>
                        {d.book?.bookTittle || 'N/A'}
                      </td>

                      <td className='text-secondary'>
                        {formatDate(d.validFrom)}
                      </td>

                      <td className='text-secondary'>
                        {formatDate(d.validTo)}
                      </td>

                      <td>
                        <span
                          className='badge rounded-pill'
                          style={{
                            background:
                              d.status === 'Active' ? '#dcfce7' : '#fee2e2',
                            color:
                              d.status === 'Active' ? '#15803d' : '#b91c1c',
                            padding: '7px 11px'
                          }}
                        >
                          {d.status}
                        </span>
                      </td>

                      <td>
                        <div className='d-flex justify-content-center gap-2'>
                          <Button
                            variant='light'
                            size='sm'
                            className='text-warning border'
                            title='Edit Discount'
                            onClick={() => goForEdit(d._id)}
                          >
                            <FaEdit />
                          </Button>

                          <Button
                            variant='light'
                            size='sm'
                            className={`border ${
                              d.status === 'Active'
                                ? 'text-danger'
                                : 'text-success'
                            }`}
                            title={
                              d.status === 'Active'
                                ? 'Deactivate Discount'
                                : 'Activate Discount'
                            }
                            onClick={() =>
                              toggleDiscountStatus(d._id, d.status)
                            }
                          >
                            {d.status === 'Active' ? (
                              <FaToggleOn size={17} />
                            ) : (
                              <FaToggleOff size={17} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='8' className='text-center py-5'>
                      <FaTag size={30} className='text-secondary mb-3' />
                      <p className='text-secondary mb-0'>No discounts found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

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
        </Card.Body>
      </Card>
    </Container>
  )
}

export default DiscountList
