import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  Card,
  Spinner,
  Alert
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaSave,
  FaBook,
  FaTruck
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function EditPincode () {
  const navigate = useNavigate()
  const { id } = useParams()

  const [books, setBooks] = useState([])

  const [book, setBook] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Get Books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${apiUrl}/books`)

        setBooks(Array.isArray(res.data.data) ? res.data.data : [])
      } catch (err) {
        console.log(err)
        setError('Unable to load books.')
      }
    }

    fetchBooks()
  }, [])

  // Get Pincode Details
  useEffect(() => {
    const fetchPincode = async () => {
      try {
        setFetching(true)

        const res = await axios.get(`${apiUrl}/pincode/${id}`)

        const data = res.data.data

        setBook(data.book?._id || data.book || '')
        setPinCode(data.pinCode || '')
        setIsAvailable(data.isAvailable)
      } catch (err) {
        console.log(err)

        setError(
          err.response?.data?.message || 'Unable to load pincode details.'
        )
      } finally {
        setFetching(false)
      }
    }

    fetchPincode()
  }, [id])

  // Update Pincode
  const updatePincode = async e => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!book) {
      setError('Please select a book.')
      return
    }

    if (!/^\d{6}$/.test(pinCode)) {
      setError('Please enter a valid 6-digit pincode.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.put(`${apiUrl}/edit/pincode/${id}`, {
        book,
        pinCode,
        isAvailable
      })

      setMessage(res.data.message || 'Pincode updated successfully.')

      setTimeout(() => {
        navigate('/pincodes')
      }, 1000)
    } catch (err) {
      console.log(err)

      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container fluid className='edit-pincode-page'>
      {/* Page Header */}
      <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4'>
        <div className='d-flex align-items-center gap-3'>
          <div className='page-icon'>
            <FaMapMarkerAlt />
          </div>

          <div>
            <h3 className='page-title mb-1'>Edit Pincode</h3>

            <p className='page-subtitle mb-0'>
              Update book delivery availability by pincode
            </p>
          </div>
        </div>

        <Button
          variant='outline-secondary'
          className='back-btn'
          onClick={() => navigate('/pincodes')}
        >
          <FaArrowLeft className='me-2' />
          Back to Pincodes
        </Button>
      </div>

      {/* Loading */}
      {fetching ? (
        <div className='loading-area'>
          <Spinner animation='border' variant='success' />

          <p className='text-muted mt-2'>Loading pincode details...</p>
        </div>
      ) : (
        <Row className='justify-content-center'>
          <Col xs={12} lg={9} xl={8}>
            <Card className='pincode-card'>
              <Card.Body className='p-4 p-md-5'>
                {/* Card Heading */}
                <div className='form-heading mb-4'>
                  <div className='form-icon'>
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <h5 className='mb-1'>Pincode Information</h5>

                    <p className='text-muted mb-0'>
                      Edit the delivery details below
                    </p>
                  </div>
                </div>

                {/* Success Message */}
                {message && (
                  <Alert variant='success'>
                    <i className='bi bi-check-circle me-2'></i>
                    {message}
                  </Alert>
                )}

                {/* Error Message */}
                {error && (
                  <Alert
                    variant='danger'
                    dismissible
                    onClose={() => setError('')}
                  >
                    <i className='bi bi-exclamation-circle me-2'></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={updatePincode}>
                  <Row className='g-3'>
                    {/* Select Book */}
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>
                          <FaBook className='me-2 text-secondary' />
                          Select Book
                          <span className='text-danger'> *</span>
                        </Form.Label>

                        <Form.Select
                          value={book}
                          onChange={e => setBook(e.target.value)}
                          required
                        >
                          <option value=''>Choose a book</option>

                          {books.map(item => (
                            <option key={item._id} value={item._id}>
                              {item.bookTittle}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {/* Pincode */}
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FaMapMarkerAlt className='me-2 text-secondary' />
                          Pincode
                          <span className='text-danger'> *</span>
                        </Form.Label>

                        <Form.Control
                          type='text'
                          placeholder='Enter 6 digit pincode'
                          value={pinCode}
                          maxLength={6}
                          inputMode='numeric'
                          onChange={e => {
                            setPinCode(
                              e.target.value.replace(/\D/g, '').slice(0, 6)
                            )
                          }}
                          required
                        />

                        <Form.Text className='text-muted'>
                          Enter a valid 6-digit postal pincode.
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    {/* Delivery Availability */}
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FaTruck className='me-2 text-secondary' />
                          Delivery Availability
                          <span className='text-danger'> *</span>
                        </Form.Label>

                        <Form.Select
                          value={String(isAvailable)}
                          onChange={e =>
                            setIsAvailable(e.target.value === 'true')
                          }
                          required
                        >
                          <option value='true'>Available</option>

                          <option value='false'>Not Available</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Availability Preview */}
                  <div
                    className={`availability-preview ${
                      isAvailable ? 'available-preview' : 'unavailable-preview'
                    }`}
                  >
                    <div>
                      <strong>Delivery Status</strong>

                      <p className='mb-0'>
                        {isAvailable
                          ? 'Delivery is available for this pincode.'
                          : 'Delivery is not available for this pincode.'}
                      </p>
                    </div>

                    <span
                      className={`availability-badge ${
                        isAvailable ? 'available-badge' : 'unavailable-badge'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </div>

                  <hr className='my-4' />

                  {/* Buttons */}
                  <div className='d-flex justify-content-end gap-2 flex-wrap'>
                    <Button
                      type='button'
                      variant='light'
                      className='cancel-btn'
                      onClick={() => navigate('/pincodes')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>

                    <Button
                      type='submit'
                      className='update-btn'
                      disabled={loading || !books.length}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            animation='border'
                            size='sm'
                            className='me-2'
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaSave className='me-2' />
                          Update Pincode
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Component Styling */}
      <style>{`
        .edit-pincode-page {
          padding: 5px 0 25px;
        }

        .page-icon {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          border-radius: 12px;
          background: #e0f2fe;
          color: #0369a1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
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

        .back-btn {
          border-radius: 8px;
          padding: 9px 16px;
          font-weight: 500;
        }

        .pincode-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
        }

        .form-heading {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .form-heading h5 {
          color: #172554;
          font-weight: 700;
        }

        .form-heading p {
          font-size: 13px;
        }

        .form-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: #e0f2fe;
          color: #0369a1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
        }

        .pincode-card .form-label {
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 7px;
        }

        .pincode-card .form-control,
        .pincode-card .form-select {
          min-height: 44px;
          border-radius: 8px;
          border-color: #cbd5e1;
          font-size: 14px;
        }

        .pincode-card .form-control:focus,
        .pincode-card .form-select:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
        }

        .availability-preview {
          margin-top: 24px;
          padding: 15px 17px;
          border-radius: 9px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .availability-preview strong {
          font-size: 14px;
        }

        .availability-preview p {
          font-size: 12px;
          margin-top: 4px;
        }

        .available-preview {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .unavailable-preview {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        .availability-badge {
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .available-badge {
          background: #dcfce7;
          color: #15803d;
        }

        .unavailable-badge {
          background: #fee2e2;
          color: #b91c1c;
        }

        .update-btn {
          background: #0f766e;
          border: 1px solid #0f766e;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 600;
        }

        .update-btn:hover {
          background: #115e59;
          border-color: #115e59;
        }

        .cancel-btn {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 20px;
          color: #475569;
          font-weight: 600;
        }

        .loading-area {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        @media (max-width: 576px) {
          .page-title {
            font-size: 21px;
          }

          .back-btn {
            width: 100%;
          }

          .pincode-card .card-body {
            padding: 20px !important;
          }

          .update-btn,
          .cancel-btn {
            flex: 1;
          }
        }
      `}</style>
    </Container>
  )
}

export default EditPincode
