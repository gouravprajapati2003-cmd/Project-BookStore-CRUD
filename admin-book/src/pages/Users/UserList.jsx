import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

function UseList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    axios({
      url: apiUrl + '/users',
      method: 'get'
    })
      .then(res => {
        setUsers(res.data.data)
      })
      .catch(err => {
        alert(err.message)
      })
  }, [])

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === 'Active' ? 'Inactive' : 'Active'

      const res = await axios.put(
        `${apiUrl}/update/status/${id}`,
        { status: newStatus }
      )

      if (res.status === 200) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === id
              ? { ...user, status: newStatus }
              : user
          )
        )
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Unable to update user status'
      )
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="text-danger text-center">User List</h2>

          <Table bordered responsive>
            <thead>
              <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>

                  <td
                    className={
                      user.status === 'Active'
                        ? 'text-success'
                        : 'text-danger'
                    }
                  >
                    {user.status}
                  </td>

                  <td>
                    <Button
                      variant={
                        user.status === 'Active'
                          ? 'danger'
                          : 'success'
                      }
                      size="sm"
                      onClick={() =>
                        toggleUserStatus(user._id, user.status)
                      }
                    >
                      {user.status === 'Active'
                        ? 'Inactive'
                        : 'Active'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

export default UseList
