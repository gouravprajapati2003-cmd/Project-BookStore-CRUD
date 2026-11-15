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
  Spinner,
  Alert
} from 'react-bootstrap'

import {
  FaTrash,
  FaEdit,
  FaEye,
  FaSearch,
  FaPlus,
  FaBook,
  FaSyncAlt
} from 'react-icons/fa'

import { useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

function BookList () {
  const [books, setBooks] = useState([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [isDelete, setIsDelete] = useState(false)
  const [searchBook, setSearchBook] = useState('')
  const [nop, setNop] = useState(1)
  const [booksPerPage] = useState(5)
  const [pageNo, setPageNo] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const navigate = useNavigate()

  // Navigate to Add Book
  function goToAddBook () {
    navigate('/add/book')
  }

  // Delete Book
  async function handleDelete (id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    )

    if (!confirmDelete) return

    try {
      setDeletingId(id)

      await axios.delete(`${apiUrl}/delete/book/${id}`)

      setIsDelete(prev => !prev)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete book')
    } finally {
      setDeletingId(null)
    }
  }

  // Navigate to Edit Book
  function handleUpdate (id) {
    navigate('/edit/book/' + id)
  }

  // Navigate to View Book
  function handleView (id) {
    navigate('/book/' + id)
  }

  // Fetch Books
  useEffect(() => {
    let isMounted = true

    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await axios.get(`${apiUrl}/books`, {
          params: {
            searchBook,
            pageNo,
            booksPerPage
          }
        })

        if (!isMounted) return

        const fetchedBooks = res.data.data || []
        const total = Number(res.data.totalBooks) || 0

        setBooks(fetchedBooks)
        setTotalBooks(total)
        setNop(Math.ceil(total / booksPerPage))
      } catch (err) {
        if (!isMounted) return

        setError(err.response?.data?.message || 'Unable to fetch books')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchBooks()

    return () => {
      isMounted = false
    }
  }, [isDelete, searchBook, pageNo, booksPerPage])

  // Search
  const handleSearch = value => {
    setSearchBook(value)
    setPageNo(1)
  }

  // Format Price
  const formatPrice = price => {
    return Number(price || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2
    })
  }

  // Pagination
  const items = []

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
      className='book-list-container p-3 p-md-4'
      style={{
        background: '#f5f7fb',
        minHeight: '100vh'
      }}
    >
      {/* Page Header */}
      <Row className='align-items-center mb-4 gy-3'>
        <Col xs={12} lg={6}>
          <div className='d-flex align-items-center gap-3'>
            <div className='book-heading-icon'>
              <FaBook size={22} />
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
            <InputGroup className='book-search'>
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
              className='add-book-btn d-flex align-items-center justify-content-center gap-2'
              onClick={goToAddBook}
            >
              <FaPlus size={12} />
              Add Book
            </Button>
          </div>
        </Col>
      </Row>

      {/* Summary Card */}
      <Row className='mb-4'>
        <Col xs={12} sm={6} lg={4}>
          <Card className='border-0 shadow-sm total-books-card'>
            <Card.Body className='d-flex justify-content-between align-items-center p-3'>
              <div>
                <small className='text-secondary fw-semibold'>
                  Total Books
                </small>

                <h3 className='fw-bold mb-1 mt-2' style={{ color: '#0f766e' }}>
                  {loading ? '—' : totalBooks}
                </h3>

                <small className='text-secondary'>
                  Books in your collection
                </small>
              </div>

              <div className='total-books-icon'>
                <FaBook size={23} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error Message */}
      {error && (
        <Alert variant='danger' dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Main Table Card */}
      <Card className='border-0 shadow-sm book-list-card'>
        <Card.Body className='p-3 p-md-4'>
          {/* Table Heading */}
          <div className='d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2'>
            <div>
              <h6 className='fw-bold mb-1' style={{ color: '#1e293b' }}>
                Book Collection
              </h6>

              <small className='text-secondary'>
                Manage your available books
              </small>
            </div>

            <div className='book-count-label'>
              {books.length} books on this page
            </div>
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
                      <Spinner animation='border' variant='success' />

                      <p className='text-secondary mt-2 mb-0'>
                        Loading books...
                      </p>
                    </td>
                  </tr>
                ) : books.length > 0 ? (
                  books.map(book => (
                    <tr key={book._id}>
                      {/* Book Details */}
                      <td className='px-3'>
                        <div className='d-flex align-items-center gap-3 book-info'>
                          <img
                            src={book.bookImage}
                            alt={book.bookTittle || 'Book cover'}
                            onError={e => {
                              e.currentTarget.style.display = 'none'
                            }}
                            className='book-image'
                          />

                          <span className='fw-semibold book-title'>
                            {book.bookTittle || 'Untitled Book'}
                          </span>
                        </div>
                      </td>

                      {/* Author */}
                      <td className='text-secondary book-author'>
                        {book.authorName || 'N/A'}
                      </td>

                      {/* Price */}
                      <td>
                        <span className='fw-bold book-price'>
                          ₹{formatPrice(book.originalPrice)}
                        </span>
                      </td>

                      {/* ISBN */}
                      <td className='text-secondary'>{book.isbnNo || 'N/A'}</td>

                      {/* Publication */}
                      <td className='text-secondary'>
                        {book.publicationYear || 'N/A'}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className='d-flex justify-content-center gap-2 book-actions'>
                          <Button
                            variant='light'
                            size='sm'
                            title='View Book'
                            className='action-view'
                            onClick={() => handleView(book._id)}
                          >
                            <FaEye />
                          </Button>

                          <Button
                            variant='light'
                            size='sm'
                            title='Edit Book'
                            className='action-edit'
                            onClick={() => handleUpdate(book._id)}
                          >
                            <FaEdit />
                          </Button>

                          <Button
                            variant='light'
                            size='sm'
                            title='Delete Book'
                            className='action-delete'
                            disabled={deletingId === book._id}
                            onClick={() => handleDelete(book._id)}
                          >
                            {deletingId === book._id ? (
                              <Spinner size='sm' animation='border' />
                            ) : (
                              <FaTrash />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='6' className='text-center py-5'>
                      <div className='empty-book-icon'>
                        <FaBook size={27} />
                      </div>

                      <h6 className='fw-bold text-secondary mb-1'>
                        No Books Found
                      </h6>

                      <small className='text-secondary'>
                        {searchBook
                          ? 'Try searching with another book title.'
                          : 'Add your first book to the collection.'}
                      </small>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && nop > 1 && (
            <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4'>
              <small className='text-secondary'>
                Showing {(pageNo - 1) * booksPerPage + 1} to{' '}
                {Math.min(pageNo * booksPerPage, totalBooks)} of {totalBooks}{' '}
                books
              </small>

              <Pagination size='sm' className='mb-0 book-pagination'>
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
        .book-list-container {
          width: 100%;
        }

        .book-list-card,
        .total-books-card {
          border-radius: 13px;
        }

        .book-heading {
          color: #172554;
        }

        .book-heading-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 12px;
          background: #ccfbf1;
          color: #0f766e;
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
          max-width: 270px;
          width: 100%;
        }

        .book-search .form-control,
        .book-search .input-group-text {
          min-height: 42px;
        }

        .add-book-btn {
          background: #0f766e;
          border: none;
          border-radius: 8px;
          padding: 9px 16px;
          min-height: 42px;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 600;
        }

        .add-book-btn:hover {
          background: #115e59;
        }

        .total-books-card {
          background: #ffffff;
          transition: transform 0.2s ease;
        }

        .total-books-card:hover {
          transform: translateY(-3px);
        }

        .total-books-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ccfbf1;
          color: #0f766e;
          border-radius: 11px;
        }

        .book-count-label {
          padding: 7px 12px;
          background: #f0fdfa;
          color: #0f766e;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
        }

        .book-table-wrapper {
          border: 1px solid #e2e8f0;
          border-radius: 9px;
        }

        .book-table {
          min-width: 850px;
        }

        .book-table thead th {
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          white-space: nowrap;
          border-bottom: 1px solid #e2e8f0;
        }

        .book-table tbody td {
          padding-top: 13px;
          padding-bottom: 13px;
          border-color: #f1f5f9;
          font-size: 13px;
          white-space: nowrap;
        }

        .book-table tbody tr:hover td {
          background: #f8fafc;
        }

        .book-info {
          min-width: 190px;
        }

        .book-image {
          width: 46px;
          height: 58px;
          min-width: 46px;
          object-fit: cover;
          border-radius: 6px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .book-title {
          color: #1e293b;
          white-space: normal;
          min-width: 120px;
          max-width: 200px;
        }

        .book-price {
          color: #0f766e;
          white-space: nowrap;
        }

        .book-actions button {
          width: 33px;
          height: 33px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          transition: all 0.2s ease;
        }

        .action-view {
          color: #2563eb;
          border: 1px solid #bfdbfe;
          background: #eff6ff;
        }

        .action-view:hover {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .action-edit {
          color: #b45309;
          border: 1px solid #fde68a;
          background: #fffbeb;
        }

        .action-edit:hover {
          background: #fef3c7;
          color: #92400e;
        }

        .action-delete {
          color: #dc2626;
          border: 1px solid #fecaca;
          background: #fef2f2;
        }

        .action-delete:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        .empty-book-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          background: #f1f5f9;
          color: #94a3b8;
          border-radius: 50%;
        }

        .book-pagination .page-link {
          color: #0f766e;
          border-radius: 6px;
          margin: 0 2px;
        }

        .book-pagination .page-item.active .page-link {
          background: #0f766e;
          border-color: #0f766e;
          color: #ffffff;
        }

        @media (max-width: 991px) {
          .book-header-actions {
            justify-content: flex-start;
          }

          .book-search {
            max-width: 100%;
          }
        }

        @media (max-width: 767px) {
          .book-list-container {
            padding: 12px !important;
          }

          .book-heading {
            font-size: 19px;
          }

          .book-heading-icon {
            width: 42px;
            height: 42px;
            min-width: 42px;
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
          }

          .book-list-card .card-body {
            padding: 15px !important;
          }

          .book-table {
            min-width: 850px;
          }

          .book-pagination {
            width: 100%;
            overflow-x: auto;
            justify-content: center;
          }

          .book-pagination .pagination {
            flex-wrap: nowrap;
          }
        }

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
