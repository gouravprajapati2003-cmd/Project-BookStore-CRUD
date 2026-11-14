import React, { useEffect, useMemo, useState } from 'react'
import {
  Card,
  Table,
  Form,
  Button,
  Badge,
  Spinner,
  Alert,
  Row,
  Col
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

const AdminList = () => {
  const [admins, setAdmins] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const token = localStorage.getItem('token')
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true'
  const loggedInAdminId = localStorage.getItem('adminId')

  // Fetch Admin List
  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await axios.get(`${apiUrl}/admins`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAdmins(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch admin list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  // Search Admin
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const name = `${admin.firstName || ''} ${admin.lastName || ''}`

      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        admin.email?.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [admins, search])

  // Summary
  const totalAdmins = admins.length

  const activeAdmins = admins.filter(admin => admin.status === 'Active').length

  const inactiveAdmins = admins.filter(
    admin => admin.status === 'Inactive'
  ).length

  const superAdmins = admins.filter(admin => admin.isSuperAdmin === true).length

  // Change Admin Status
  const handleStatusChange = async admin => {
    if (!isSuperAdmin) {
      alert('Only Super Admin can change admin status.')
      return
    }

    if (admin.isSuperAdmin) {
      alert('Super Admin status cannot be changed from this page.')
      return
    }

    if (String(admin._id) === String(loggedInAdminId)) {
      alert('You cannot change your own account status.')
      return
    }

    const newStatus = admin.status === 'Active' ? 'Inactive' : 'Active'

    const confirmChange = window.confirm(
      `Are you sure you want to ${newStatus} this admin?`
    )

    if (!confirmChange) return

    try {
      setUpdatingId(admin._id)

      const res = await axios.patch(
        `${apiUrl}/admin/status/${admin._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.data.success) {
        setAdmins(prevAdmins =>
          prevAdmins.map(item =>
            item._id === admin._id ? { ...item, status: newStatus } : item
          )
        )

        alert(`Admin status changed to ${newStatus}.`)
      } else {
        alert(res.data.message || 'Unable to update status.')
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update admin status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className='p-3 p-md-4'>
      {/* Page Heading */}
      <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4'>
        <div>
          <h3 className='fw-bold mb-1' style={{ color: '#172554' }}>
            Admin Management
          </h3>
          <p className='text-muted mb-0'>
            Manage administrators and their account status.
          </p>
        </div>

        <Link
          to='/create/admin'
          className='btn text-white fw-semibold px-4'
          style={{
            backgroundColor: '#172554',
            borderRadius: '8px'
          }}
        >
          <i className='bi bi-person-plus-fill me-2'></i>
          Add Admin
        </Link>
      </div>

      {/* Summary Cards */}
      <Row className='g-3 mb-4'>
        <Col md={3} sm={6}>
          <Card className='border-0 shadow-sm h-100'>
            <Card.Body>
              <div className='text-muted small'>Total Admins</div>
              <h3 className='fw-bold mb-0'>{totalAdmins}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className='border-0 shadow-sm h-100'>
            <Card.Body>
              <div className='text-muted small'>Active Admins</div>
              <h3 className='fw-bold text-success mb-0'>{activeAdmins}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className='border-0 shadow-sm h-100'>
            <Card.Body>
              <div className='text-muted small'>Inactive Admins</div>
              <h3 className='fw-bold text-danger mb-0'>{inactiveAdmins}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className='border-0 shadow-sm h-100'>
            <Card.Body>
              <div className='text-muted small'>Super Admins</div>
              <h3 className='fw-bold mb-0' style={{ color: '#172554' }}>
                {superAdmins}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Admin Table */}
      <Card className='border-0 shadow-sm'>
        <Card.Body>
          <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3'>
            <h5 className='fw-bold mb-0'>Admin List</h5>

            <Form.Control
              type='search'
              placeholder='Search by name or email...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: '280px' }}
            />
          </div>

          {error && (
            <Alert variant='danger'>
              {error}
              <Button variant='link' className='p-0 ms-2' onClick={fetchAdmins}>
                Try Again
              </Button>
            </Alert>
          )}

          {loading ? (
            <div className='text-center py-5'>
              <Spinner animation='border' variant='primary' />
              <p className='text-muted mt-2 mb-0'>Loading admins...</p>
            </div>
          ) : (
            <div className='table-responsive'>
              <Table hover bordered className='align-middle mb-0'>
                <thead className='table-light'>
                  <tr>
                    <th>#</th>
                    <th>Administrator</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin, index) => (
                      <tr key={admin._id}>
                        <td>{index + 1}</td>

                        <td className='fw-semibold'>
                          {admin.firstName || 'Admin'} {admin.lastName || ''}
                        </td>

                        <td>{admin.email}</td>

                        <td>
                          {admin.isSuperAdmin ? (
                            <Badge bg='dark'>Super Admin</Badge>
                          ) : (
                            <Badge bg='primary'>Admin</Badge>
                          )}
                        </td>

                        <td>
                          <div className='d-flex align-items-center gap-2 flex-wrap'>
                            <Badge
                              bg={
                                admin.status === 'Active' ? 'success' : 'danger'
                              }
                            >
                              {admin.status || 'Unknown'}
                            </Badge>

                            {isSuperAdmin && !admin.isSuperAdmin && (
                              <Button
                                size='sm'
                                variant={
                                  admin.status === 'Active'
                                    ? 'outline-danger'
                                    : 'outline-success'
                                }
                                disabled={
                                  updatingId === admin._id ||
                                  String(admin._id) === String(loggedInAdminId)
                                }
                                onClick={() => handleStatusChange(admin)}
                              >
                                {updatingId === admin._id ? (
                                  <Spinner animation='border' size='sm' />
                                ) : admin.status === 'Active' ? (
                                  'Deactivate'
                                ) : (
                                  'Activate'
                                )}
                              </Button>
                            )}
                          </div>
                        </td>

                        <td>
                          {admin.createdAt
                            ? new Date(admin.createdAt).toLocaleDateString(
                                'en-IN'
                              )
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='6' className='text-center py-4 text-muted'>
                        No admins found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminList
