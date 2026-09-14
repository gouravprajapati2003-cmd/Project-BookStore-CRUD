import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Table, Button, Form, Pagination } from 'react-bootstrap'
import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL
function BookList() {
    let [books, setBooks] = useState([])
    let [isDelete, setIsDelete] = useState(false)
    let [searchBook, setSearchBook] = useState('')
    let [nop, setNop] = useState(1);
    let [booksPerPage, setBooksPerPage] = useState(3)
    let [pageNo, setPageNumber] = useState(1)
    let navigate = useNavigate()
    let items = []
    for (let i = 1; i <= nop; i++) {
        items.push(<Pagination.Item key={i} onClick={() => setPageNumber(i)}> {i}</Pagination.Item>)

    }
    function goToAddBook() {
        navigate('/add/book')
    }
    function handleDelete(id) {
        axios({
            //url: 'http://localhost:3000/delete/book/' + id,
            url: apiUrl + '/delete/book/' + id,
            method: 'delete'
        }).then((res) => {
            alert('Data has been deleted Successfuly...')
            setIsDelete(true)
        }).catch((err) => {
            alert(err)
        })
    }
    function handleUpdate(id) {
        navigate('/edit/book/' + id)
    }
    useEffect(() => {
        axios({
            url: 'http://localhost:3000/books',
            //url: apiUrl + '/books',
            method: 'get',
            params: {
                searchBook: searchBook,
                pageNo: pageNo,
                booksPerPage: booksPerPage
            }
        }).then((res) => {
            setBooks(res.data.data)
            setNop(Math.ceil(res.data.totalBooks / 3))
        }).catch((err) => {
            alert(err)
        })
    }, [isDelete, searchBook, pageNo])
    return (
        <Container>
            <Row>
                <Col>
                    <Form>
                        <Form.Group>
                            <Form.Control type="text" placeholder="Enter book title to search...." onChange={(e) => setSearchBook(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Form>
                    <Button className="mt-5" variant="success" style={{ float: 'right' }} onClick={goToAddBook}>Add Book +</Button>
                    <h3 className="text-center text-danger mt-5">Book List</h3>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Book Title</th>
                                <th>Author Name</th>
                                <th>Price</th>
                                <th>ISBN No</th>
                                <th>No Of Pages</th>
                                <th>Publication</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                books.map((book) =>
                                    <tr>
                                        <td><img src={book.bookImage} width="30px" height="30px"></img></td>
                                        <td>{book.bookTitle}</td>
                                        <td>{book.authorName}</td>
                                        <td>{book.price}</td>
                                        <td>{book.isbnNo}</td>
                                        <td>{book.nop}</td>
                                        <td>{book.publication}</td>
                                        <td>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(book._id)}>Delete</Button>
                                            <Button variant="warning" size="sm" className="ms-1" onClick={() => handleUpdate(book._id)}>Edit</Button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>

                    </Table>
                    <Pagination size="md" className="justify-content-center">{items}</Pagination>
                </Col>
            </Row>

        </Container >

    )
}
export default BookList