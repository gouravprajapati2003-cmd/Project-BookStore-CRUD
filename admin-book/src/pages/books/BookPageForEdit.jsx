import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
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
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaUpload,
  FaTrash,
  FaBook
} from 'react-icons/fa'

const apiUrl = import.meta.env.VITE_API_URL

function SectionHeading ({ icon, title, subtitle }) {
  return (
    <div className='d-flex align-items-center gap-3 mb-4'>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: '#e0f2f1',
          color: '#0f766e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18
        }}
      >
        {icon}
      </div>

      <div>
        <h5 className='mb-1 fw-bold' style={{ color: '#172554' }}>
          {title}
        </h5>
        <small className='text-muted'>{subtitle}</small>
      </div>
    </div>
  )
}

function Field ({
  label,
  name,
  book,
  manageUpdate,
  type = 'text',
  required = false,
  placeholder = '',
  as,
  rows,
  min,
  max,
  step
}) {
  return (
    <Form.Group className='mb-3'>
      <Form.Label className='fw-semibold' style={{ color: '#334155' }}>
        {label}
      </Form.Label>

      <Form.Control
        type={type}
        name={name}
        value={book[name] ?? ''}
        onChange={manageUpdate}
        placeholder={placeholder}
        required={required}
        as={as}
        rows={rows}
        min={min}
        max={max}
        step={step}
        style={{
          borderRadius: 8,
          padding: '10px 12px',
          borderColor: '#dbe2ea'
        }}
      />
    </Form.Group>
  )
}

function BookPageForEdit () {
  const params = useParams()
  const navigate = useNavigate()
  const id = params.id

  const [book, setBook] = useState({
    bookTittle: '',
    authorName: '',
    imprint: '',
    publicationYear: '',
    productFrom: '',
    publisher: '',
    genre: '',
    isbnNo: '',
    bookCategory: '',
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
    bookImage: ''
  })

  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch existing book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)

        const res = await axios.get(`${apiUrl}/book/for/edit/${id}`)

        const bookData = res.data.book || res.data.data || res.data

        setBook(prev => ({
          ...prev,
          ...bookData
        }))

        setImagePreview(bookData.bookImage || '')
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || 'Unable to load book details.')
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  // Update text fields
  const manageUpdate = e => {
    const { name, value } = e.target

    setBook(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Select new book image
  const handleImageChange = e => {
    const file = e.target.files?.[0]

    if (!file) return

    setError('')
    setSuccess('')

    // Validate image type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      e.target.value = ''
      return
    }

    // Validate image size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10 MB.')
      e.target.value = ''
      return
    }

    setSelectedImage(file)

    // Show selected image preview
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  // Remove newly selected image and restore existing image
  const removeSelectedImage = () => {
    setSelectedImage(null)
    setImagePreview(book.bookImage || '')

    const fileInput = document.getElementById('bookImageInput')

    if (fileInput) {
      fileInput.value = ''
    }
  }

  // Submit updated book
  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const formData = new FormData()

      // Append all book fields
      Object.entries(book).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value)
        }
      })

      // Append new image only when selected
      if (selectedImage) {
        formData.append('file', selectedImage)
      }

      const res = await axios.put(`${apiUrl}/edit/book/${id}`, formData)

      setSuccess(res.data.message || 'Book updated successfully!')

      setTimeout(() => {
        navigate('/books')
      }, 1200)
    } catch (err) {
      console.error(err)

      setError(err.response?.data?.message || 'Unable to update book.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '60vh' }}
      >
        <Spinner animation='border' style={{ color: '#0f766e' }} />
      </div>
    )
  }

  return (
    <Container fluid className='py-3 px-2 px-md-4'>
      <style>{`
        .edit-book-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .edit-book-card .form-control:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 0.2rem rgba(15, 118, 110, 0.12);
        }

        .image-preview {
          width: 100%;
          max-width: 230px;
          height: 250px;
          object-fit: contain;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          padding: 8px;
        }

        .image-upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 20px;
          background: #f8fafc;
        }

        .edit-action-btn {
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 600;
        }
      `}</style>

      {/* Page Header */}
      <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4'>
        <div>
          <h3 className='fw-bold mb-1' style={{ color: '#172554' }}>
            Edit Book
          </h3>
          <p className='text-muted mb-0'>
            Update book information and book cover image
          </p>
        </div>

        <Button
          variant='outline-secondary'
          onClick={() => navigate('/books')}
          className='edit-action-btn'
        >
          <FaArrowLeft className='me-2' />
          Back to Books
        </Button>
      </div>

      {error && (
        <Alert variant='danger' dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && <Alert variant='success'>{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className='edit-book-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaBook />}
              title='Basic Information'
              subtitle='Update the basic details of your book'
            />

            <Row>
              <Col md={6}>
                <Field
                  label='Book Title'
                  name='bookTittle'
                  book={book}
                  manageUpdate={manageUpdate}
                  required
                  placeholder='Enter book title'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Author Name'
                  name='authorName'
                  book={book}
                  manageUpdate={manageUpdate}
                  required
                  placeholder='Enter author name'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Imprint'
                  name='imprint'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter imprint'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Publication Year'
                  name='publicationYear'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter publication year'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Product From'
                  name='productFrom'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter product source'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Publisher'
                  name='publisher'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter publisher'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Genre'
                  name='genre'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter genre'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='ISBN Number'
                  name='isbnNo'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter ISBN number'
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Category */}
        <Card className='edit-book-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaBook />}
              title='Book Category'
              subtitle='Update book classification details'
            />

            <Row>
              <Col md={6}>
                <Field
                  label='Book Category'
                  name='bookCategory'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter category'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Edition'
                  name='edition'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter edition'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Language'
                  name='language'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter language'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Country of Origin'
                  name='countryOfOrigin'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter country'
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Description */}
        <Card className='edit-book-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaBook />}
              title='Book Description'
              subtitle='Update short and detailed descriptions'
            />

            <Row>
              <Col md={12}>
                <Field
                  label='Short Description'
                  name='shortDescription'
                  book={book}
                  manageUpdate={manageUpdate}
                  as='textarea'
                  rows={3}
                  placeholder='Enter short description'
                />
              </Col>

              <Col md={12}>
                <Field
                  label='Full Description'
                  name='description'
                  book={book}
                  manageUpdate={manageUpdate}
                  as='textarea'
                  rows={5}
                  placeholder='Enter complete book description'
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Manufacturer and Packager */}
        <Card className='edit-book-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaBook />}
              title='Manufacturer & Packager'
              subtitle='Update manufacturer and packager information'
            />

            <Row>
              <Col md={6}>
                <Field
                  label='Manufacturer Name'
                  name='nameOfManufacturer'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter manufacturer name'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Manufacturer Address'
                  name='addressOfManufacturer'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter manufacturer address'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Packager Name'
                  name='nameOfPackager'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter packager name'
                />
              </Col>

              <Col md={6}>
                <Field
                  label='Packager Address'
                  name='addressOfPackager'
                  book={book}
                  manageUpdate={manageUpdate}
                  placeholder='Enter packager address'
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Pricing and Rating */}
        <Card className='edit-book-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaBook />}
              title='Pricing & Rating'
              subtitle='Update price and book rating details'
            />

            <Row>
              <Col md={4}>
                <Field
                  label='Original Price (₹)'
                  name='originalPrice'
                  book={book}
                  manageUpdate={manageUpdate}
                  type='number'
                  min='0'
                  step='0.01'
                  placeholder='Enter original price'
                />
              </Col>

              <Col md={4}>
                <Field
                  label='Rating'
                  name='rating'
                  book={book}
                  manageUpdate={manageUpdate}
                  type='number'
                  min='0'
                  max='5'
                  step='0.1'
                  placeholder='Enter rating'
                />
              </Col>

              <Col md={4}>
                <Field
                  label='Reviews'
                  name='reviews'
                  book={book}
                  manageUpdate={manageUpdate}
                  type='number'
                  min='0'
                  placeholder='Enter reviews count'
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Book Image Update */}
        <Card className='edit-book-card mb-4'>
          <Card.Body className='p-3 p-md-4'>
            <SectionHeading
              icon={<FaImage />}
              title='Book Cover Image'
              subtitle='View the current image or upload a replacement'
            />

            <Row className='align-items-center g-4'>
              {/* Image Preview */}
              <Col md={4} className='text-center'>
                <div className='mb-2 fw-semibold'>
                  {selectedImage ? 'New Image Preview' : 'Current Book Image'}
                </div>

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt='Book cover preview'
                    className='image-preview'
                  />
                ) : (
                  <div className='image-preview d-flex flex-column justify-content-center align-items-center mx-auto text-muted'>
                    <FaImage size={40} />
                    <small className='mt-2'>No image available</small>
                  </div>
                )}

                {selectedImage && (
                  <div className='mt-2'>
                    <small className='text-success fw-semibold'>
                      New image selected
                    </small>
                  </div>
                )}
              </Col>

              {/* Image Upload */}
              <Col md={8}>
                <div className='image-upload-area'>
                  <div className='d-flex align-items-center gap-2 mb-2'>
                    <FaUpload style={{ color: '#0f766e' }} />
                    <strong>Upload New Book Image</strong>
                  </div>

                  <p className='text-muted small mb-3'>
                    Select a JPG, PNG, WEBP or other image file. Maximum file
                    size: 10 MB.
                  </p>

                  <Form.Control
                    id='bookImageInput'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                  />

                  {selectedImage && (
                    <div className='mt-3'>
                      <div className='small text-muted mb-2'>
                        Selected file: {selectedImage.name}
                      </div>

                      <Button
                        type='button'
                        variant='outline-danger'
                        size='sm'
                        onClick={removeSelectedImage}
                      >
                        <FaTrash className='me-2' />
                        Remove Selected Image
                      </Button>
                    </div>
                  )}

                  {!selectedImage && (
                    <div className='small text-muted mt-3'>
                      Your existing image will remain unchanged if you do not
                      select a new image.
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className='d-flex flex-wrap justify-content-end gap-2 mb-4'>
          <Button
            type='button'
            variant='outline-secondary'
            className='edit-action-btn'
            onClick={() => navigate('/books')}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type='submit'
            className='edit-action-btn'
            style={{
              background: '#0f766e',
              borderColor: '#0f766e',
              color: '#fff'
            }}
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner animation='border' size='sm' className='me-2' />
                Updating...
              </>
            ) : (
              <>
                <FaSave className='me-2' />
                Update Book
              </>
            )}
          </Button>
        </div>
      </Form>
    </Container>
  )
}

export default BookPageForEdit
