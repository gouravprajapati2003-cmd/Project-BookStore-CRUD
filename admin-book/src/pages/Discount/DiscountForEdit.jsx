import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Alert
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from 'axios'
import 'bootstrap-icons/font/bootstrap-icons.css'

const apiUrl = import.meta.env.VITE_API_URL

function DiscountForEdit () {
  const { id } = useParams()
  const navigate = useNavigate()

  const [discount, setDiscount] = useState({
    book: '',
    discountName: '',
    discountType: '',
    discountValue: '',
    validFrom: '',
    validTo: ''
  })

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch discount details
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await axios.get(`${apiUrl}/discount/for/edit/${id}`)

        console.log('DISCOUNT FOR EDIT:', res.data)

        const data = res.data.data

        setDiscount({
          book: data?.book?._id || data?.book || '',
          discountName: data?.discountName || '',
          discountType: data?.discountType || '',
          discountValue: data?.discountValue ?? '',
          validFrom: data?.validFrom ? data.validFrom.split('T')[0] : '',
          validTo: data?.validTo ? data.validTo.split('T')[0] : ''
        })

        setBooks(Array.isArray(res.data.books) ? res.data.books : [])
      } catch (err) {
        console.log(err)
        setError(
          err.response?.data?.message || 'Unable to load discount details.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDiscount()
  }, [id])

  // Handle input changes
  function manageUpdate (e) {
    const { name, value } = e.target

    setDiscount(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Update discount
  const editDiscount = async e => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (
      !discount.book ||
      !discount.discountName.trim() ||
      !discount.discountType ||
      discount.discountValue === '' ||
      !discount.validFrom ||
      !discount.validTo
    ) {
      setError('Please fill in all fields.')
      return
    }

    const value = Number(discount.discountValue)

    if (!Number.isFinite(value) || value <= 0) {
      setError('Discount value must be greater than 0.')
      return
    }

    if (discount.discountType === 'Percentage' && value > 100) {
      setError('Percentage discount cannot be greater than 100%.')
      return
    }

    if (discount.validTo < discount.validFrom) {
      setError('Valid Upto date cannot be earlier than Valid From.')
      return
    }

    try {
      setSubmitting(true)

      await axios.put(`${apiUrl}/edit/discount/${id}`, {
        ...discount,
        discountValue: value
      })

      setSuccess('Discount updated successfully!')

      setTimeout(() => {
        navigate('/discounts')
      }, 1000)
    } catch (err) {
      console.log(err)

      setError(
        err.response?.data?.message ||
          'Failed to update discount. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container fluid className='discount-edit-page'>
      {/* Page Header */}
      <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4'>
        <div>
          <h3 className='page-title mb-1'>
            <i className='bi bi-pencil-square me-2'></i>
            Edit Discount
          </h3>

          <p className='page-subtitle mb-0'>
            Update the discount details for your book
          </p>
        </div>

        <Button
          variant='outline-secondary'
          className='back-btn'
          onClick={() => navigate('/discounts')}
        >
          <i className='bi bi-arrow-left me-2'></i>
          Back to Discounts List
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className='loading-area'>
          <Spinner animation='border' variant='success' />
          <p className='mt-2 text-muted'>Loading discount details...</p>
        </div>
      ) : (
        <Row className='justify-content-center'>
          <Col xs={12} lg={9} xl={8}>
            <Card className='discount-card'>
              <Card.Body className='p-4 p-md-5'>
                <div className='form-heading mb-4'>
                  <div className='form-icon'>
                    <i className='bi bi-tag-fill'></i>
                  </div>

                  <div>
                    <h5 className='mb-1'>Discount Information</h5>
                    <p className='text-muted mb-0'>
                      Update the information below
                    </p>
                  </div>
                </div>

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

                {success && (
                  <Alert variant='success'>
                    <i className='bi bi-check-circle me-2'></i>
                    {success}
                  </Alert>
                )}

                <Form onSubmit={editDiscount}>
                  <Row className='g-3'>
                    {/* Select Book */}
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>
                          Select Book <span className='text-danger'>*</span>
                        </Form.Label>

                        <Form.Select
                          name='book'
                          value={discount.book}
                          onChange={manageUpdate}
                          required
                        >
                          <option value=''>Choose a book</option>

                          {books.map(b => (
                            <option key={b._id} value={b._id}>
                              {b.bookTittle}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {/* Discount Name */}
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Discount Name <span className='text-danger'>*</span>
                        </Form.Label>

                        <Form.Control
                          type='text'
                          name='discountName'
                          placeholder='Enter discount name'
                          value={discount.discountName}
                          onChange={manageUpdate}
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Discount Type */}
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Discount Type <span className='text-danger'>*</span>
                        </Form.Label>

                        <Form.Select
                          name='discountType'
                          value={discount.discountType}
                          onChange={manageUpdate}
                          required
                        >
                          <option value=''>Choose discount type</option>
                          <option value='Percentage'>Percentage</option>
                          <option value='Fixed'>Fixed</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {/* Discount Value */}
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Discount Value <span className='text-danger'>*</span>
                        </Form.Label>

                        <Form.Control
                          type='number'
                          name='discountValue'
                          placeholder='Enter discount value'
                          value={discount.discountValue}
                          onChange={manageUpdate}
                          min='0'
                          step='any'
                          required
                        />

                        <Form.Text className='text-muted'>
                          {discount.discountType === 'Percentage'
                            ? 'Enter percentage (e.g. 10 for 10%)'
                            : 'Enter fixed discount amount'}
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    {/* Valid From */}
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Valid From <span className='text-danger'>*</span>
                        </Form.Label>

                        <Form.Control
                          type='date'
                          name='validFrom'
                          value={discount.validFrom}
                          onChange={manageUpdate}
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Valid Upto */}
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Valid Upto <span className='text-danger'>*</span>
                        </Form.Label>

                        <Form.Control
                          type='date'
                          name='validTo'
                          value={discount.validTo}
                          onChange={manageUpdate}
                          min={discount.validFrom || undefined}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr className='my-4' />

                  {/* Action Buttons */}
                  <div className='d-flex justify-content-end gap-2 flex-wrap'>
                    <Button
                      type='button'
                      variant='light'
                      className='cancel-btn'
                      onClick={() => navigate('/discounts')}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>

                    <Button
                      type='submit'
                      className='update-btn'
                      disabled={submitting || books.length === 0}
                    >
                      {submitting ? (
                        <>
                          <Spinner
                            size='sm'
                            animation='border'
                            className='me-2'
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className='bi bi-check-circle me-2'></i>
                          Update Discount
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
        .discount-edit-page {
          padding: 5px 0 25px;
        }

        .page-title {
          color: #172554;
          font-weight: 700;
          font-size: 25px;
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

        .discount-card {
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
          background: #e0f2f1;
          color: #0f766e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
        }

        .discount-card .form-label {
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 7px;
        }

        .discount-card .form-control,
        .discount-card .form-select {
          min-height: 44px;
          border-radius: 8px;
          border-color: #cbd5e1;
          font-size: 14px;
        }

        .discount-card .form-control:focus,
        .discount-card .form-select:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
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

          .discount-card .card-body {
            padding: 20px !important;
          }

          .back-btn {
            width: 100%;
          }
        }
      `}</style>
    </Container>
  )
}

export default DiscountForEdit
