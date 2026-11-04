import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Col,
  Container,
  Row,
  Table,
  Button,
  Form,
  Pagination,
  InputGroup,
  Card
} from 'react-bootstrap'
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaSearch,
  FaPlus,
  FaBook
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

function BookList () {
  const [books, setBooks] = useState([])
  const [isDelete, setIsDelete] = useState(false)
  const [searchBook, setSearchBook] = useState('')
  const [nop, setNop] = useState(1)
  const [booksPerPage] = useState(5)
  const [pageNo, setPageNo] = useState(1)

  const navigate = useNavigate()

  function goToAddBook () {
    navigate('/add/book')
  }

  function handleDelete (id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    )

    if (!confirmDelete) return

    axios({
      url: apiUrl + '/delete/book/' + id,
      method: 'delete'
    })
      .then(() => {
        alert('Book deleted successfully')
        setIsDelete(prev => !prev)
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Unable to delete book')
      })
  }

  function handleUpdate (id) {
    navigate('/edit/book/' + id)
  }

  function handleView (id) {
    navigate('/book/' + id)
  }

  useEffect(() => {
    axios({
      url: apiUrl + '/books',
      method: 'get',
      params: {
        searchBook: searchBook,
        pageNo: pageNo,
        booksPerPage: booksPerPage
      }
    })
      .then(res => {
        setBooks(res.data.data || [])
        setNop(Math.ceil(res.data.totalBooks / booksPerPage))
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Unable to fetch books')
      })
  }, [isDelete, searchBook, pageNo, booksPerPage])

  const handleSearch = value => {
    setSearchBook(value)
    setPageNo(1)
  }

  let items = []

  for (let i = 1; i <= nop; i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={pageNo === i}
        onClick={() => setPageNo(i)}
      >
        {i}
      </Pagination.Item>
    )
  }

  return (
    <Container
      fluid
      className='py-3 px-3 px-md-4'
      style={{ background: '#f5f7fb', minHeight: '100vh' }}
    >
      <Card className='border-0 shadow-sm' style={{ borderRadius: '14px' }}>
        <Card.Body className='p-3 p-md-4'>
          <Row className='align-items-center mb-4 gy-3'>
            <Col md={6}>
              <div className='d-flex align-items-center gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center'
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#e0f2fe',
                    color: '#0369a1'
                  }}
                >
                  <FaBook size={21} />
                </div>

                <div>
                  <h4 className='mb-1 fw-bold' style={{ color: '#172554' }}>
                    Manage Books
                  </h4>
                  <small className='text-secondary'>
                    View and manage your bookstore collection
                  </small>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className='d-flex align-items-center justify-content-md-end gap-2 flex-wrap'>
                <InputGroup size='sm' style={{ maxWidth: '240px' }}>
                  <InputGroup.Text className='bg-white border-end-0'>
                    <FaSearch className='text-secondary' />
                  </InputGroup.Text>
                  <Form.Control
                    type='text'
                    placeholder='Search book title...'
                    value={searchBook}
                    onChange={e => handleSearch(e.target.value)}
                    className='border-start-0 shadow-none'
                  />
                </InputGroup>

                <Button
                  variant='primary'
                  size='sm'
                  className='d-flex align-items-center gap-2 px-3'
                  style={{ background: '#2563eb', border: 'none' }}
                  onClick={goToAddBook}
                >
                  <FaPlus size={11} />
                  Add Book
                </Button>
              </div>
            </Col>
          </Row>

          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h6 className='fw-bold mb-0' style={{ color: '#334155' }}>
              Book Collection
            </h6>
            <small className='text-secondary'>
              {books.length} books on this page
            </small>
          </div>

          <div className='table-responsive'>
            <Table hover className='align-middle mb-0'>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th className='py-3 px-3 text-secondary small'>BOOK</th>
                  <th className='py-3 text-secondary small'>AUTHOR</th>
                  <th className='py-3 text-secondary small'>PRICE</th>
                  <th className='py-3 text-secondary small'>ISBN NO.</th>
                  <th className='py-3 text-secondary small'>PUBLICATION</th>
                  <th className='py-3 text-center text-secondary small'>
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {books.length > 0 ? (
                  books.map(book => (
                    <tr key={book._id}>
                      <td className='px-3'>
                        <div className='d-flex align-items-center gap-3'>
                          <img
                            src={book.bookImage}
                            alt={book.bookTittle}
                            style={{
                              width: '48px',
                              height: '58px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              background: '#f1f5f9'
                            }}
                          />
                          <span
                            className='fw-semibold'
                            style={{ color: '#1e293b' }}
                          >
                            {book.bookTittle}
                          </span>
                        </div>
                      </td>

                      <td className='text-secondary'>{book.authorName}</td>

                      <td>
                        <span className='fw-semibold text-success'>
                          ₹{book.originalPrice}
                        </span>
                      </td>

                      <td className='text-secondary'>{book.isbnNo}</td>

                      <td className='text-secondary'>{book.publicationYear}</td>

                      <td>
                        <div className='d-flex justify-content-center gap-2'>
                          <Button
                            variant='light'
                            size='sm'
                            className='text-primary border'
                            title='View Book'
                            onClick={() => handleView(book._id)}
                          >
                            <FaEye />
                          </Button>

                          <Button
                            variant='light'
                            size='sm'
                            className='text-warning border'
                            title='Edit Book'
                            onClick={() => handleUpdate(book._id)}
                          >
                            <FaEdit />
                          </Button>

                          <Button
                            variant='light'
                            size='sm'
                            className='text-danger border'
                            title='Delete Book'
                            onClick={() => handleDelete(book._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='6' className='text-center py-5'>
                      <FaBook size={30} className='text-secondary mb-3' />
                      <p className='text-secondary mb-0'>No books found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {nop > 1 && (
            <div className='d-flex justify-content-center mt-4'>
              <Pagination size='sm' className='mb-0'>
                <Pagination.Prev
                  disabled={pageNo === 1}
                  onClick={() => setPageNo(prev => prev - 1)}
                />
                {items}
                <Pagination.Next
                  disabled={pageNo === nop}
                  onClick={() => setPageNo(prev => prev + 1)}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default BookList
