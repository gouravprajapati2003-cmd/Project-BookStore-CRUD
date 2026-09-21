import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

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

  // Get book data
  useEffect(() => {
    axios({
      url: apiUrl + '/book/for/edit/' + id,
      method: 'get'
    })
      .then(res => {
        const data = res.data.data

        setBook({
          bookTittle: data?.bookTittle || '',
          authorName: data?.authorName || '',
          imprint: data?.imprint || '',
          publicationYear: data?.publicationYear || '',
          productFrom: data?.productFrom || '',
          publisher: data?.publisher || '',
          genre: data?.genre || '',
          isbnNo: data?.isbnNo || '',
          bookCategory: data?.bookCategory || '',
          edition: data?.edition || '',
          language: data?.language || '',
          description: data?.description || '',
          shortDescription: data?.shortDescription || '',
          countryOfOrigin: data?.countryOfOrigin || '',
          nameOfManufacturer: data?.nameOfManufacturer || '',
          addressOfManufacturer: data?.addressOfManufacturer || '',
          nameOfPackager: data?.nameOfPackager || '',
          addressOfPackager: data?.addressOfPackager || '',
          rating: data?.rating || '',
          reviews: data?.reviews || '',
          originalPrice: data?.originalPrice || '',
          bookImage: data?.bookImage || ''
        })
      })
      .catch(err => {
        console.log(err)
        alert('Unable to fetch book data')
      })
  }, [id])

  // Handle input change
  function manageUpdate (e) {
    const name = e.target.name
    const value = e.target.value

    setBook(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  // Update book
  function editBook (e) {
    e.preventDefault()

    axios({
      url: apiUrl + '/edit/book/' + id,
      method: 'put',
      data: book
    })
      .then(() => {
        alert('Book has been updated successfully')

        navigate('/books')
      })
      .catch(err => {
        console.log(err)
        alert('Unable to update book')
      })
  }

  return (
    <Container className='mt-4 mb-5'>
      <Row className='justify-content-center'>
        <Col xs={12}>
          <div className='border p-4 rounded bg-white'>
            <h3 className='text-center text-danger mb-4'>Edit the Book</h3>

            <Form onSubmit={editBook}>
              {/* ROW 1 */}
              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Book Title</Form.Label>

                    <Form.Control
                      type='text'
                      name='bookTittle'
                      value={book.bookTittle}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Author Name</Form.Label>

                    <Form.Control
                      type='text'
                      name='authorName'
                      value={book.authorName}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Imprint</Form.Label>

                    <Form.Control
                      type='text'
                      name='imprint'
                      value={book.imprint}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 2 */}
              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Publication Year</Form.Label>

                    <Form.Control
                      type='text'
                      name='publicationYear'
                      value={book.publicationYear}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Product From</Form.Label>

                    <Form.Control
                      type='text'
                      name='productFrom'
                      value={book.productFrom}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Publisher</Form.Label>

                    <Form.Control
                      type='text'
                      name='publisher'
                      value={book.publisher}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 3 */}
              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Genre</Form.Label>

                    <Form.Control
                      type='text'
                      name='genre'
                      value={book.genre}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>ISBN No</Form.Label>

                    <Form.Control
                      type='text'
                      name='isbnNo'
                      value={book.isbnNo}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Book Category</Form.Label>

                    <Form.Control
                      type='text'
                      name='bookCategory'
                      value={book.bookCategory}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 4 */}
              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Edition</Form.Label>

                    <Form.Control
                      type='text'
                      name='edition'
                      value={book.edition}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Language</Form.Label>

                    <Form.Control
                      type='text'
                      name='language'
                      value={book.language}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Rating</Form.Label>

                    <Form.Control
                      type='text'
                      name='rating'
                      value={book.rating}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 5 */}
              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Reviews</Form.Label>

                    <Form.Control
                      type='text'
                      name='reviews'
                      value={book.reviews}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Original Price</Form.Label>

                    <Form.Control
                      type='text'
                      name='originalPrice'
                      value={book.originalPrice}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Country Of Origin</Form.Label>

                    <Form.Control
                      type='text'
                      name='countryOfOrigin'
                      value={book.countryOfOrigin}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 6 */}
              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Name Of Manufacturer</Form.Label>

                    <Form.Control
                      type='text'
                      name='nameOfManufacturer'
                      value={book.nameOfManufacturer}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Address Of Manufacturer</Form.Label>

                    <Form.Control
                      type='text'
                      name='addressOfManufacturer'
                      value={book.addressOfManufacturer}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Name Of Packager</Form.Label>

                    <Form.Control
                      type='text'
                      name='nameOfPackager'
                      value={book.nameOfPackager}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 7 */}
              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Address Of Packager</Form.Label>

                    <Form.Control
                      type='text'
                      name='addressOfPackager'
                      value={book.addressOfPackager}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Book Image</Form.Label>

                    <Form.Control
                      type='text'
                      name='bookImage'
                      value={book.bookImage}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>{/* Empty column */}</Col>
              </Row>

              {/* ROW 8 */}
              <Row>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Short Description</Form.Label>

                    <Form.Control
                      as='textarea'
                      rows={4}
                      name='shortDescription'
                      value={book.shortDescription}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Description</Form.Label>

                    <Form.Control
                      as='textarea'
                      rows={4}
                      name='description'
                      value={book.description}
                      onChange={manageUpdate}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className='text-center mt-3'>
                <Button variant='danger' type='submit' className='me-2'>
                  Update Book
                </Button>

                <Button
                  variant='secondary'
                  type='button'
                  onClick={() => navigate('/books')}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default BookPageForEdit
