import { useNavigate } from 'react-router-dom'
import { Button, Col, Container, Row, Form, Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

function PincodeList () {

  const navigate = useNavigate()

  const [pincodes, setPincodes] = useState([])
  const [searchPincode, setSearchPincode] = useState('')

  const goToAddPincode = () => {
    navigate('/add/pincode')
  }

  useEffect(() => {

    axios({
      url: `${apiUrl}/pincodes`,
      method: 'get'
    })
      .then((res) => {
        setPincodes(res.data.data)
      })
      .catch((err) => {
        alert(err)
      })

  }, [])


  const goForEdit = (id) => {
    navigate('/edit/pincode/' + id)
  }


  // Search pincode
  const filteredPincodes = pincodes.filter((p) =>
    p.pinCode?.includes(searchPincode)
  )


  return (

    <Container>

      <Row>

        <Col>

          <Form>

            <Form.Group>

              <Form.Control
                type='text'
                placeholder='Type pincode to search'
                value={searchPincode}
                maxLength={6}
                onChange={(e) => {

                  setSearchPincode(
                    e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6)
                  )

                }}
              />

            </Form.Group>

          </Form>


          <Button
            className='mt-5'
            variant='success'
            style={{ float: 'right' }}
            onClick={goToAddPincode}
          >
            Add Pincode +
          </Button>

        </Col>

      </Row>


      <Row>

        <h3 className='mt-2 text-center text-danger'>
          Pincode List
        </h3>


        <Table bordered hover>

          <thead>

            <tr>

              <th>Book Name</th>

              <th>Pincode</th>

              <th>Availability</th>

              <th>Created Date</th>

              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {
              filteredPincodes.length > 0 ? (

                filteredPincodes.map((p) => (

                  <tr key={p._id}>

                    <td>
                      {p.book?.bookTittle || 'N/A'}
                    </td>

                    <td>
                      {p.pinCode}
                    </td>

                    <td
                      className={
                        p.isAvailable
                          ? 'text-success'
                          : 'text-danger'
                      }
                    >
                      {
                        p.isAvailable
                          ? 'Available'
                          : 'Not Available'
                      }
                    </td>

                    <td>
                      {
                        new Date(
                          p.createdAt
                        ).toLocaleDateString('en-IN', {
                          timeZone: 'Asia/Kolkata'
                        })
                      }
                    </td>

                    <td>

                      <Button
                        variant='warning'
                        size='sm'
                        className='ms-1'
                        onClick={() => goForEdit(p._id)}
                      >
                        Edit
                      </Button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan='5'
                    className='text-center text-muted'
                  >
                    No Pincode Found
                  </td>

                </tr>

              )
            }

          </tbody>

        </Table>

      </Row>

    </Container>

  )
}

export default PincodeList

