import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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

import 'bootstrap-icons/font/bootstrap-icons.css'

const apiUrl = import.meta.env.VITE_API_URL

function CreateDiscount () {
  const navigate = useNavigate()

  const [books, setBooks] = useState([])
  const [book, setBook] = useState('')
  const [discountName, setDiscountName] = useState('')
  const [discountType, setDiscountType] = useState('')
  const [discountValue, setDiscountValue] = useState('')
  const [validFrom, setValidFrom] = useState('')
  const [validTo, setValidTo] = useState('')

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)

        const res = await axios.get(`${apiUrl}/books/for/discount`)
        setBooks(res.data.data || [])
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Unable to load books. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const addDiscount = async e => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (
      !book ||
      !discountName.trim() ||
      !discountType ||
      discountValue === '' ||
      !validFrom ||
      !validTo
    ) {
      setError('Please fill in all required fields.')
      return
    }

    const value = Number(discountValue)

    if (!Number.isFinite(value) || value <= 0) {
      setError('Discount value must be greater than zero.')
      return
    }

    if (discountType === 'Percentage' && value > 100) {
      setError('Percentage discount cannot be greater than 100%.')
      return
    }

    if (new Date(validTo) < new Date(validFrom)) {
      setError('Valid Upto date cannot be earlier than Valid From date.')
      return
    }

    const data = {
      book,
      discountName: discountName.trim(),
      discountValue: value,
      discountType,
      validFrom,
      validTo
    }

    try {
      setSubmitting(true)

      await axios.post(`${apiUrl}/add/discount`, data)

      setSuccess('Discount has been added successfully.')

      setTimeout(() => {
        navigate('/discounts')
      }, 1000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to add discount. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container fluid className='discount-page py-3 py-md-4'>
      <style>{`
        .discount-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .discount-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .discount-title {
          color: #172554;
          font-size: 25px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .discount-subtitle {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .discount-back-btn {
          border: 1px solid #cbd5e1 !important;
          background: #ffffff !important;
          color: #334155 !important;
          border-radius: 8px !important;
          padding: 9px 16px !important;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .discount-back-btn:hover {
          background: #f1f5f9 !important;
          border-color: #94a3b8 !important;
        }

        .discount-card {
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
          overflow: hidden;
        }

        .discount-card-header {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 20px 24px;
        }

        .discount-card-header h5 {
          color: #172554;
          font-size: 17px;
          font-weight: 700;
          margin: 0;
        }

        .discount-card-body {
          padding: 25px;
        }

        .discount-label {
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .discount-input {
          min-height: 44px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          box-shadow: none !important;
        }

        .discount-input:focus {
          border-color: #2563eb;
        }

        .discount-help {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 6px;
        }

        .discount-submit {
          background: #172554 !important;
          border: 1px solid #172554 !important;
          border-radius: 8px !important;
          padding: 10px 22px !important;
          font-size: 14px;
          font-weight: 600;
        }

        .discount-submit:hover {
          background: #2563eb !important;
          border-color: #2563eb !important;
        }

        .discount-submit:disabled {
          opacity: 0.7;
        }

        @media (max-width: 575px) {
          .discount-title {
            font-size: 21px;
          }

          .discount-header {
            align-items: flex-start;
          }

          .discount-card-body {
            padding: 18px;
          }

          .discount-card-header {
            padding: 17px 18px;
          }

          .discount-submit {
            width: 100%;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className='discount-header'>
        <div>
          <h3 className='discount-title'>
            <i className='bi bi-percent me-2' />
            Create Discount
          </h3>

          <p className='discount-subtitle'>
            Add a new discount offer to your bookstore.
          </p>
        </div>

        <Button
          className='discount-back-btn'
          onClick={() => navigate('/discounts')}
        >
          <i className='bi bi-arrow-left me-2' />
          Back
        </Button>
      </div>

      {/* Form Card */}
      <Card className='discount-card'>
        <Card.Header className='discount-card-header'>
          <h5>
            <i className='bi bi-tag me-2 text-primary' />
            Discount Information
          </h5>
        </Card.Header>

        <Card.Body className='discount-card-body'>
          {error && (
            <Alert variant='danger' dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && <Alert variant='success'>{success}</Alert>}

          <Form onSubmit={addDiscount}>
            <Row className='g-3'>
              {/* Select Book */}
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className='discount-label'>
                    Select Book <span className='text-danger'>*</span>
                  </Form.Label>

                  <Form.Select
                    className='discount-input'
                    value={book}
                    onChange={e => setBook(e.target.value)}
                    disabled={loading}
                    required
                  >
                    <option value=''>
                      {loading ? 'Loading books...' : 'Select a book'}
                    </option>

                    {books.map(item => (
                      <option key={item._id} value={item._id}>
                        {item.bookTittle}
                      </option>
                    ))}
                  </Form.Select>

                  {loading && (
                    <div className='discount-help'>
                      <Spinner animation='border' size='sm' className='me-2' />
                      Loading available books...
                    </div>
                  )}
                </Form.Group>
              </Col>

              {/* Discount Name */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className='discount-label'>
                    Discount Name <span className='text-danger'>*</span>
                  </Form.Label>

                  <Form.Control
                    type='text'
                    className='discount-input'
                    placeholder='Enter discount name'
                    value={discountName}
                    onChange={e => setDiscountName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Discount Type */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className='discount-label'>
                    Discount Type <span className='text-danger'>*</span>
                  </Form.Label>

                  <Form.Select
                    className='discount-input'
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value)}
                    required
                  >
                    <option value=''>Select discount type</option>
                    <option value='Percentage'>Percentage (%)</option>
                    <option value='Fixed'>Fixed Amount (₹)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Discount Value */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className='discount-label'>
                    Discount Value <span className='text-danger'>*</span>
                  </Form.Label>

                  <Form.Control
                    type='number'
                    className='discount-input'
                    placeholder='Enter discount value'
                    min='0'
                    max={discountType === 'Percentage' ? '100' : undefined}
                    step='any'
                    value={discountValue}
                    onChange={e => setDiscountValue(e.target.value)}
                    required
                  />

                  <div className='discount-help'>
                    {discountType === 'Percentage'
                      ? 'Enter percentage between 1 and 100.'
                      : discountType === 'Fixed'
                      ? 'Enter discount amount in rupees.'
                      : 'Select discount type to see the value format.'}
                  </div>
                </Form.Group>
              </Col>

              {/* Valid From */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className='discount-label'>
                    Valid From <span className='text-danger'>*</span>
                  </Form.Label>

                  <Form.Control
                    type='date'
                    className='discount-input'
                    value={validFrom}
                    onChange={e => setValidFrom(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Valid Upto */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className='discount-label'>
                    Valid Upto <span className='text-danger'>*</span>
                  </Form.Label>

                  <Form.Control
                    type='date'
                    className='discount-input'
                    value={validTo}
                    min={validFrom || undefined}
                    onChange={e => setValidTo(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className='my-4' />

            {/* Buttons */}
            <div className='d-flex justify-content-end flex-wrap gap-2'>
              <Button
                variant='light'
                className='border px-4'
                type='button'
                onClick={() => navigate('/discounts')}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                type='submit'
                className='discount-submit'
                disabled={submitting || loading || books.length === 0}
              >
                {submitting ? (
                  <>
                    <Spinner animation='border' size='sm' className='me-2' />
                    Adding...
                  </>
                ) : (
                  <>
                    <i className='bi bi-check-circle me-2' />
                    Add Discount
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CreateDiscount
