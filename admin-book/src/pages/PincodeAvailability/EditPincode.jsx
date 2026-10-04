import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Container, Row, Form, Card } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

function EditPincode () {

  const navigate = useNavigate()
  const params = useParams()

  const id = params.id

  const [books, setBooks] = useState([])

  const [book, setBook] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')


  // Get Books
  useEffect(() => {

    axios({
      url: `${apiUrl}/books`,
      method: 'get'
    })
      .then((res) => {

        setBooks(res.data.data)

      })
      .catch((err) => {

        console.log(err)

      })

  }, [])


  // Get Pincode Details
  useEffect(() => {

    axios({
      url: `${apiUrl}/pincode/${id}`,
      method: 'get'
    })
      .then((res) => {

        const data = res.data.data

        setBook(data.book?._id || data.book || '')
        setPinCode(data.pinCode || '')
        setIsAvailable(data.isAvailable)

      })
      .catch((err) => {

        console.log(err)

      })

  }, [id])


  // Update Pincode
  const updatePincode = () => {

    setMessage('')
    setError('')


    // Book validation
    if (!book) {

      setError('Please select a book')

      return

    }


    // Pincode validation
    if (!/^\d{6}$/.test(pinCode)) {

      setError('Please enter a valid 6-digit pincode')

      return

    }


    setLoading(true)


    axios({
      url: `${apiUrl}/edit/pincode/${id}`,
      method: 'put',
      data: {
        book: book,
        pinCode: pinCode,
        isAvailable: isAvailable
      }
    })
      .then((res) => {

        setMessage(
          res.data.message || 'Pincode updated successfully'
        )

        setTimeout(() => {

          navigate('/pincodes')

        }, 1000)

      })
      .catch((err) => {

        console.log(err)

        if (err.response && err.response.data) {

          setError(
            err.response.data.message ||
            'Something went wrong'
          )

        } else {

          setError('Something went wrong')

        }

      })
      .finally(() => {

        setLoading(false)

      })

  }


  return (

    <Container className='py-4'>

      <Row className='justify-content-center'>

        <Col md={7} lg={6}>

          <Card className='shadow-sm'>

            <Card.Body>

              <h3 className='fw-bold mb-4'>
                Edit Pincode
              </h3>


              {/* Success Message */}

              {message && (

                <div className='alert alert-success'>
                  {message}
                </div>

              )}


              {/* Error Message */}

              {error && (

                <div className='alert alert-danger'>
                  {error}
                </div>

              )}


              {/* Book */}

              <Form.Group className='mb-3'>

                <Form.Label className='fw-semibold'>
                  Select Book
                </Form.Label>

                <Form.Select
                  value={book}
                  onChange={(e) =>
                    setBook(e.target.value)
                  }
                >

                  <option value=''>
                    Select Book
                  </option>


                  {books.map((item) => (

                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.bookTittle}
                    </option>

                  ))}

                </Form.Select>

              </Form.Group>


              {/* Pincode */}

              <Form.Group className='mb-3'>

                <Form.Label className='fw-semibold'>
                  Pincode
                </Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Enter 6 digit pincode'
                  value={pinCode}
                  maxLength={6}
                  onChange={(e) => {

                    setPinCode(
                      e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6)
                    )

                  }}
                />

              </Form.Group>


              {/* Availability */}

              <Form.Group className='mb-4'>

                <Form.Label className='fw-semibold'>
                  Delivery Availability
                </Form.Label>

                <Form.Select
                  value={isAvailable}
                  onChange={(e) =>
                    setIsAvailable(
                      e.target.value === 'true'
                    )
                  }
                >

                  <option value='true'>
                    Available
                  </option>

                  <option value='false'>
                    Not Available
                  </option>

                </Form.Select>

              </Form.Group>


              {/* Update Button */}

              <Button
                variant='success'
                className='w-100'
                onClick={updatePincode}
                disabled={loading}
              >

                {loading
                  ? 'Updating...'
                  : 'Update Pincode'
                }

              </Button>


              {/* Back Button */}

              <Button
                variant='secondary'
                className='w-100 mt-2'
                onClick={() => navigate('/pincodes')}
              >
                Back
              </Button>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>

  )
}

export default EditPincode

