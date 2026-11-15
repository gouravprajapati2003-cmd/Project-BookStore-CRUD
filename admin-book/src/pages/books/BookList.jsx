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
  Card,
  Spinner
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
  const [loading, setLoading] = useState(true)

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
    setLoading(true)

    axios({
      url: apiUrl + '/books',
      method: 'get',
      params: {
        searchBook,
        pageNo,
        booksPerPage
      }
    })
      .then(res => {
        setBooks(res.data.data || [])
        setNop(Math.ceil(res.data.totalBooks / booksPerPage))
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Unable to fetch books')
      })
      .finally(() => setLoading(false))
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
      className='book-list-container py-3 px-3 px-md-4'
      style={{ background: '#f5f7fb', minHeight: '100vh' }}
    >
      <Card className='border-0 shadow-sm book-list-card'>
        <Card.Body className='p-3 p-md-4'>
          {/* Header */}
          <Row className='align-items-center mb-4 gy-3'>
            <Col xs={12} lg={6}>
              <div className='d-flex align-items-center gap-3'>
                <div className='book-heading-icon'>
                  <FaBook size={21} />
                </div>

                <div>
                  <h4 className='mb-1 fw-bold book-heading'>Manage Books</h4>
                  <small className='text-secondary'>
                    View and manage your bookstore collection
                  </small>
                </div>
              </div>
            </Col>

            <Col xs={12} lg={6}>
              <div className='book-header-actions'>
                <InputGroup size='sm' className='book-search'>
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
                  className='d-flex align-items-center justify-content-center gap-2 px-3 add-book-btn'
                  onClick={goToAddBook}
                >
                  <FaPlus size={11} />
                  Add Book
                </Button>
              </div>
            </Col>
          </Row>

          {/* Table Heading */}
          <div className='d-flex justify-content-between align-items-center mb-3 gap-2'>
            <h6 className='fw-bold mb-0' style={{ color: '#334155' }}>
              Book Collection
            </h6>

            <small className='text-secondary text-nowrap'>
              {books.length} books on this page
            </small>
          </div>

          {/* Table */}
          <div className='table-responsive book-table-wrapper'>
            <Table hover className='align-middle mb-0 book-table'>
              <thead>
                <tr>
                  <th className='py-3 px-3'>BOOK</th>
                  <th className='py-3'>AUTHOR</th>
                  <th className='py-3'>PRICE</th>
                  <th className='py-3'>ISBN NO.</th>
                  <th className='py-3'>PUBLICATION</th>
                  <th className='py-3 text-center'>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='6' className='text-center py-5'>
                      <Spinner animation='border' variant='primary' />
                      <p className='text-secondary mt-2 mb-0'>
                        Loading books...
                      </p>
                    </td>
                  </tr>
                ) : books.length > 0 ? (
                  books.map(book => (
                    <tr key={book._id}>
                      <td className='px-3'>
                        <div className='d-flex align-items-center gap-3 book-info'>
                          <img
                            src={book.bookImage}
                            alt={book.bookTittle}
                            onError={e => {
                              e.currentTarget.style.display = 'none'
                            }}
                            className='book-image'
                          />

                          <span className='fw-semibold book-title'>
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
                        <div className='d-flex justify-content-center gap-2 book-actions'>
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

          {/* Pagination */}
          {nop > 1 && (
            <div className='d-flex justify-content-center mt-4 book-pagination'>
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

      {/* Responsive Styling */}
      <style>{`
        .book-list-card {
          border-radius: 14px;
        }

        .book-heading {
          color: #172554;
        }

        .book-heading-icon {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border-radius: 12px;
          background: #e0f2fe;
          color: #0369a1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .book-header-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }

        .book-search {
          max-width: 240px;
          width: 100%;
        }

        .add-book-btn {
          background: #2563eb;
          border: none;
          white-space: nowrap;
          min-height: 32px;
        }

        .book-table {
          min-width: 850px;
        }

        .book-table thead th {
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .book-image {
          width: 48px;
          height: 58px;
          min-width: 48px;
          object-fit: cover;
          border-radius: 6px;
          background: #f1f5f9;
        }

        .book-title {
          color: #1e293b;
          min-width: 130px;
        }

        .book-actions button {
          min-width: 32px;
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 991px) {
          .book-header-actions {
            justify-content: flex-start;
          }

          .book-search {
            max-width: 280px;
          }

          .book-list-container {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .book-list-container {
            padding: 12px !important;
          }

          .book-list-card {
            border-radius: 10px;
          }

          .book-list-card .card-body {
            padding: 15px !important;
          }

          .book-heading-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
          }

          .book-heading {
            font-size: 19px;
          }

          .book-header-actions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }

          .book-search {
            max-width: 100%;
          }

          .add-book-btn {
            width: 100%;
            min-height: 36px;
          }

          .book-table {
            min-width: 800px;
          }

          .book-image {
            width: 40px;
            height: 50px;
            min-width: 40px;
          }

          .book-title {
            font-size: 13px;
          }

          .book-pagination {
            overflow-x: auto;
            justify-content: flex-start !important;
          }

          .book-pagination .pagination {
            flex-wrap: nowrap;
            margin: auto;
          }
        }

        /* Small Mobile */
        @media (max-width: 380px) {
          .book-heading {
            font-size: 17px;
          }

          .book-list-card .card-body {
            padding: 12px !important;
          }
        }
      `}</style>
    </Container>
  )
}

export default BookList
