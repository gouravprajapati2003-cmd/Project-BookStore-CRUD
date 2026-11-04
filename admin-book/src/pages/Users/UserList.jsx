import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Card,
  Form,
  InputGroup,
  Pagination
} from 'react-bootstrap'
import {
  FaUsers,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function UserList () {
  const [users, setUsers] = useState([])
  const [searchUser, setSearchUser] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [usersPerPage] = useState(5)

  useEffect(() => {
    axios({
      url: apiUrl + '/users',
      method: 'get'
    })
      .then(res => {
        setUsers(res.data.data || [])
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Unable to fetch users')
      })
  }, [])

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'

      const res = await axios.put(`${apiUrl}/update/status/${id}`, {
        status: newStatus
      })

      if (res.status === 200) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        )
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update user status')
    }
  }

  const handleSearch = value => {
    setSearchUser(value)
    setPageNo(1)
  }

  const filteredUsers = users.filter(user => {
    const search = searchUser.toLowerCase()

    return (
      user.firstName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.status?.toLowerCase().includes(search)
    )
  })

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const startIndex = (pageNo - 1) * usersPerPage

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  )

  return (
    <Container
      fluid
      className='py-3 px-3 px-md-4'
      style={{ background: '#f4f6fa', minHeight: '100vh' }}
    >
      <Card
        className='border-0 shadow-sm'
        style={{ borderRadius: '16px', overflow: 'hidden' }}
      >
        <Card.Body className='p-3 p-md-4'>
          <Row className='align-items-center mb-4 gy-3'>
            <Col md={6}>
              <div className='d-flex align-items-center gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center'
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '13px',
                    background: '#eef2ff',
                    color: '#4338ca'
                  }}
                >
                  <FaUsers size={21} />
                </div>

                <div>
                  <h4 className='fw-bold mb-1' style={{ color: '#172554' }}>
                    Manage Users
                  </h4>
                  <small className='text-secondary'>
                    Manage customer accounts and user status
                  </small>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className='d-flex justify-content-md-end'>
                <InputGroup size='sm' style={{ maxWidth: '260px' }}>
                  <InputGroup.Text className='bg-white border-end-0'>
                    <FaSearch className='text-secondary' />
                  </InputGroup.Text>

                  <Form.Control
                    type='text'
                    placeholder='Search users...'
                    value={searchUser}
                    onChange={e => handleSearch(e.target.value)}
                    className='border-start-0 shadow-none'
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>

          <Row className='g-3 mb-4'>
            <Col sm={6} md={4}>
              <div
                className='p-3'
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <small className='text-secondary'>Total Users</small>
                    <h4
                      className='fw-bold mb-0 mt-1'
                      style={{ color: '#1e293b' }}
                    >
                      {users.length}
                    </h4>
                  </div>
                  <FaUsers size={25} style={{ color: '#64748b' }} />
                </div>
              </div>
            </Col>

            <Col sm={6} md={4}>
              <div
                className='p-3'
                style={{
                  background: '#ecfdf5',
                  borderRadius: '12px',
                  border: '1px solid #a7f3d0'
                }}
              >
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <small style={{ color: '#047857' }}>Active Users</small>
                    <h4
                      className='fw-bold mb-0 mt-1'
                      style={{ color: '#047857' }}
                    >
                      {users.filter(u => u.status === 'Active').length}
                    </h4>
                  </div>
                  <FaUserCheck size={25} style={{ color: '#059669' }} />
                </div>
              </div>
            </Col>

            <Col sm={6} md={4}>
              <div
                className='p-3'
                style={{
                  background: '#fff1f2',
                  borderRadius: '12px',
                  border: '1px solid #fecdd3'
                }}
              >
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <small style={{ color: '#be123c' }}>Inactive Users</small>
                    <h4
                      className='fw-bold mb-0 mt-1'
                      style={{ color: '#be123c' }}
                    >
                      {users.filter(u => u.status !== 'Active').length}
                    </h4>
                  </div>
                  <FaUserTimes size={25} style={{ color: '#e11d48' }} />
                </div>
              </div>
            </Col>
          </Row>

          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h6 className='fw-bold mb-0' style={{ color: '#334155' }}>
              User Collection
            </h6>

            <small className='text-secondary'>
              {filteredUsers.length} users found
            </small>
          </div>

          <div className='table-responsive'>
            <Table hover className='align-middle mb-0'>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th className='py-3 px-3 text-secondary small'>FULL NAME</th>
                  <th className='py-3 text-secondary small'>EMAIL ADDRESS</th>
                  <th className='py-3 text-secondary small'>STATUS</th>
                  <th className='py-3 text-center text-secondary small'>
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map(user => (
                    <tr key={user._id}>
                      <td>
                        {`${user.firstName || ''} ${
                          user.lastName || ''
                        }`.trim()}
                      </td>

                      <td style={{ color: '#64748b', fontSize: '13px' }}>
                        {user.email || 'N/A'}
                      </td>

                      <td>
                        <span
                          className='badge rounded-pill'
                          style={{
                            background:
                              user.status === 'Active' ? '#ecfdf5' : '#fff1f2',
                            color:
                              user.status === 'Active' ? '#047857' : '#be123c',
                            border: `1px solid ${
                              user.status === 'Active' ? '#a7f3d0' : '#fecdd3'
                            }`,
                            padding: '7px 12px'
                          }}
                        >
                          {user.status || 'Inactive'}
                        </span>
                      </td>

                      <td>
                        <div className='d-flex justify-content-center'>
                          <Button
                            variant='light'
                            size='sm'
                            className={`border d-flex align-items-center gap-2 ${
                              user.status === 'Active'
                                ? 'text-danger'
                                : 'text-success'
                            }`}
                            title={
                              user.status === 'Active'
                                ? 'Deactivate User'
                                : 'Activate User'
                            }
                            onClick={() =>
                              toggleUserStatus(user._id, user.status)
                            }
                          >
                            {user.status === 'Active' ? (
                              <>
                                <FaToggleOn size={17} />
                                Inactive
                              </>
                            ) : (
                              <>
                                <FaToggleOff size={17} />
                                Active
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='5' className='text-center py-5'>
                      <FaUsers size={32} className='text-secondary mb-3' />
                      <h6 className='fw-semibold text-secondary'>
                        No Users Found
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

          {totalPages > 1 && (
            <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4'>
              <small className='text-secondary'>
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{' '}
                {filteredUsers.length} users
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

export default UserList
