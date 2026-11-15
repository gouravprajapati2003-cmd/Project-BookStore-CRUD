import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  Alert,
  Spinner
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import {
  FaBook,
  FaArrowLeft,
  FaImage,
  FaInfoCircle,
  FaBuilding,
  FaTag,
  FaRupeeSign,
  FaUpload,
  FaCheckCircle
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

// Section Heading Component
function SectionHeading ({ icon, title, subtitle }) {
  return (
    <div className='add-section-heading'>
      <div className='add-section-icon'>{icon}</div>
      <div>
        <h6 className='fw-bold mb-1'>{title}</h6>
        <small className='text-secondary'>{subtitle}</small>
      </div>
    </div>
  )
}

// Reusable Input Field Component
function Field ({
  label,
  name,
  bookData,
  handleChange,
  type = 'text',
  required = true,
  placeholder = '',
  as,
  rows,
  min,
  max,
  step
}) {
  return (
    <Form.Group className='mb-3'>
      <Form.Label className='add-form-label'>
        {label}
        {required && <span className='text-danger ms-1'>*</span>}
      </Form.Label>

      <Form.Control
        type={type}
        as={as}
        rows={rows}
        name={name}
        value={bookData[name] ?? ''}
        onChange={handleChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        required={required}
        min={min}
        max={max}
        step={step}
        className='add-form-control'
      />
    </Form.Group>
  )
}

function AddBook () {
  const navigate = useNavigate()

  const [bookData, setBookData] = useState({
    bookTittle: '',
    authorName: '',
    imprint: '',
    publicationYear: '',
    productFrom: '',
    publisher: '',
    genre: '',
    isbnNo: '',
    bookCategory: '',
    bookSubCategory: '',
    edition: '',
    language: '',
    description: '',
    shortDescription: '',
    countryOfOrigin: '',
    nameOfManufacturer: '',
    addressOfManufacturer: '',
    nameOfPackager: '',
    addressOfPackager: '',
    rating: '',
    reviews: '',
    originalPrice: '',
    file: null
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [imagePreview, setImagePreview] = useState('')

  // Handle Input Change
  const handleChange = e => {
    const { name, value, files, type } = e.target

    const updatedValue = type === 'file' ? files[0] : value

    setBookData(prev => ({
      ...prev,
      [name]: updatedValue
    }))

    if (type === 'file' && files[0]) {
      setImagePreview(URL.createObjectURL(files[0]))
    }
  }

  // Add Book API
  const addBook = async e => {
    e.preventDefault()

    if (!bookData.file) {
      setMessageType('danger')
      setMessage('Please select a book image.')
      return
    }

    if (Number(bookData.originalPrice) <= 0) {
      setMessageType('danger')
      setMessage('Please enter a valid original price.')
      return
    }

    setLoading(true)
    setMessage('')

    const formData = new FormData()

    Object.keys(bookData).forEach(key => {
      if (key !== 'file' && bookData[key] !== null) {
        formData.append(key, bookData[key])
      }
    })

    formData.append('file', bookData.file)

    try {
      const res = await axios({
        url: apiUrl + '/add/book',
        method: 'post',
        data: formData
      })

      setMessageType('success')
      setMessage(res.data.message || 'Book added successfully!')

      setTimeout(() => {
        navigate('/books')
      }, 1000)
    } catch (err) {
      console.log(err)

      setMessageType('danger')
      setMessage(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container fluid className='add-book-page p-3 p-md-4'>
      {/* Header */}
      <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4'>
        <div className='d-flex align-items-center gap-3'>
          <div className='add-page-icon'>
            <FaBook size={22} />
          </div>

          <div>
            <h4 className='fw-bold mb-1 add-page-title'>Add New Book</h4>
            <small className='text-secondary'>
              Add a new book to your bookstore collection
            </small>
          </div>
        </div>

        <Button
          variant='light'
          className='add-back-btn'
          onClick={() => navigate('/books')}
        >
          <FaArrowLeft className='me-2' />
          Back to Books
        </Button>
      </div>

      {/* Alert */}
      {message && (
        <Alert
          variant={messageType}
          dismissible
          onClose={() => setMessage('')}
          className='shadow-sm'
        >
          {message}
        </Alert>
      )}

      <Form onSubmit={addBook}>
        {/* Basic Information */}
        <Card className='add-form-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaInfoCircle />}
              title='Basic Information'
              subtitle='Enter the basic details of the book'
            />

            <hr className='add-divider' />

            <Row>
              <Col xs={12} md={6} lg={4}>
                <Field
                  label='Book Title'
                  name='bookTittle'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Field
                  label='Author Name'
                  name='authorName'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Field
                  label='Imprint'
                  name='imprint'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Field
                  label='Publication Year'
                  name='publicationYear'
                  type='number'
                  min='0'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Field
                  label='Product From'
                  name='productFrom'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Field
                  label='Publisher'
                  name='publisher'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Field
                  label='Genre'
                  name='genre'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Field
                  label='ISBN Number'
                  name='isbnNo'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Field
                  label='Edition'
                  name='edition'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <Field
                  label='Language'
                  name='language'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Category Information */}
        <Card className='add-form-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaTag />}
              title='Category Information'
              subtitle='Specify the book category and subcategory'
            />

            <hr className='add-divider' />

            <Row>
              <Col xs={12} md={6}>
                <Field
                  label='Book Category'
                  name='bookCategory'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6}>
                <Field
                  label='Book Sub Category'
                  name='bookSubCategory'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Description */}
        <Card className='add-form-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaBook />}
              title='Book Description'
              subtitle='Provide detailed and short descriptions'
            />

            <hr className='add-divider' />

            <Row>
              <Col xs={12} md={6}>
                <Field
                  label='Description'
                  name='description'
                  as='textarea'
                  rows={4}
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6}>
                <Field
                  label='Short Description'
                  name='shortDescription'
                  as='textarea'
                  rows={4}
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Manufacturer Information */}
        <Card className='add-form-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaBuilding />}
              title='Manufacturer & Packager Details'
              subtitle='Enter manufacturer and packaging information'
            />

            <hr className='add-divider' />

            <Row>
              <Col xs={12} md={6}>
                <Field
                  label='Country of Origin'
                  name='countryOfOrigin'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6}>
                <Field
                  label='Manufacturer Name'
                  name='nameOfManufacturer'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6}>
                <Field
                  label='Manufacturer Address'
                  name='addressOfManufacturer'
                  as='textarea'
                  rows={3}
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6}>
                <Field
                  label='Packager Name'
                  name='nameOfPackager'
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={6}>
                <Field
                  label='Packager Address'
                  name='addressOfPackager'
                  as='textarea'
                  rows={3}
                  bookData={bookData}
                  handleChange={handleChange}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Price Information */}
        <Card className='add-form-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaRupeeSign />}
              title='Pricing Information'
              subtitle='Set the original price of the book'
            />

            <hr className='add-divider' />

            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className='mb-3'>
                  <Form.Label className='add-form-label'>
                    Original Price <span className='text-danger'>*</span>
                  </Form.Label>

                  <InputGroup>
                    <InputGroup.Text className='add-input-icon'>
                      ₹
                    </InputGroup.Text>

                    <Form.Control
                      type='number'
                      name='originalPrice'
                      min='0.01'
                      step='0.01'
                      value={bookData.originalPrice}
                      onChange={handleChange}
                      placeholder='Enter original price'
                      required
                      className='add-form-control'
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Book Image */}
        <Card className='add-form-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaImage />}
              title='Book Cover Image'
              subtitle='Upload the cover image of your book'
            />

            <hr className='add-divider' />

            <Row className='align-items-center'>
              <Col xs={12} md={7}>
                <Form.Group>
                  <Form.Label className='add-form-label'>
                    Select Book Image <span className='text-danger'>*</span>
                  </Form.Label>

                  <Form.Control
                    type='file'
                    name='file'
                    accept='image/*'
                    onChange={handleChange}
                    required
                    className='add-form-control'
                  />

                  <Form.Text className='text-secondary'>
                    Select an image file for the book cover.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs={12} md={5}>
                <div className='image-preview-box mt-3 mt-md-0'>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt='Book preview'
                      className='image-preview'
                    />
                  ) : (
                    <div className='text-center text-secondary'>
                      <FaUpload size={26} />
                      <p className='mb-0 mt-2 small'>
                        Image preview will appear here
                      </p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <Card className='add-form-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <div className='d-flex justify-content-end flex-wrap gap-2'>
              <Button
                type='button'
                variant='light'
                className='add-cancel-btn'
                disabled={loading}
                onClick={() => navigate('/books')}
              >
                Cancel
              </Button>

              <Button
                type='submit'
                className='add-submit-btn'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size='sm' animation='border' className='me-2' />
                    Adding Book...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className='me-2' />
                    Add Book
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>

      {/* Styling */}
      <style>{`
        .add-book-page {
          background: #f5f7fb;
          min-height: 100%;
        }

        .add-page-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ccfbf1;
          color: #0f766e;
          border-radius: 12px;
        }

        .add-page-title {
          color: #172554;
        }

        .add-back-btn {
          border: 1px solid #e2e8f0;
          color: #334155;
          border-radius: 8px;
          padding: 9px 15px;
          font-size: 13px;
          font-weight: 600;
        }

        .add-back-btn:hover {
          background: #e2e8f0;
        }

        .add-form-card {
          border: 0;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.045);
        }

        .add-section-heading {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .add-section-heading h6 {
          color: #1e293b;
        }

        .add-section-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #ccfbf1;
          color: #0f766e;
          font-size: 17px;
        }

        .add-divider {
          border-color: #e2e8f0;
          margin: 20px 0;
          opacity: 1;
        }

        .add-form-label {
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 7px;
        }

        .add-form-control {
          min-height: 43px;
          border: 1px solid #dbe2ea;
          border-radius: 7px;
          font-size: 13px;
          box-shadow: none !important;
        }

        textarea.add-form-control {
          min-height: auto;
        }

        .add-form-control:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.09) !important;
        }

        .add-input-icon {
          background: #f8fafc;
          border-color: #dbe2ea;
          color: #0f766e;
          font-weight: 700;
        }

        .image-preview-box {
          min-height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
        }

        .image-preview {
          max-width: 100%;
          max-height: 190px;
          object-fit: contain;
          border-radius: 7px;
        }

        .add-cancel-btn,
        .add-submit-btn {
          min-width: 115px;
          min-height: 42px;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 600;
        }

        .add-cancel-btn {
          border: 1px solid #cbd5e1;
          color: #475569;
        }

        .add-submit-btn {
          background: #0f766e;
          border: 1px solid #0f766e;
        }

        .add-submit-btn:hover {
          background: #115e59;
          border-color: #115e59;
        }

        @media (max-width: 575px) {
          .add-book-page {
            padding: 12px !important;
          }

          .add-page-title {
            font-size: 19px;
          }

          .add-back-btn {
            width: 100%;
          }

          .add-form-card .card-body {
            padding: 16px !important;
          }

          .add-section-heading h6 {
            font-size: 14px;
          }

          .add-submit-btn,
          .add-cancel-btn {
            flex: 1;
          }
        }
      `}</style>
    </Container>
  )
}

export default AddBook
