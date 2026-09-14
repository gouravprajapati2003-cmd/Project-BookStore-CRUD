import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
const apiUrl = import.meta.env.VITE_API_URL
import axios from "axios"
function AddBook() {
    let navigate = useNavigate()
    let [bookTitle, setBookTitle] = useState('')
    let [authorName, setAuthorName] = useState('')
    let [price, setPrice] = useState(0)
    let [isbnNo, setIsbnNo] = useState('')
    let [nop, setNop] = useState(0)
    let [publication, setPublication] = useState('')
    let [file, setFile] = useState('')
    function addBook() {
        // let data = {
        //     bookTitle: bookTitle,
        //     authorName: authorName,
        //     price: price,
        //     isbnNo: isbnNo,
        //     nop: nop,
        //     publication: publication
        // }
        let formData = new FormData()
        formData.append('bookTitle', bookTitle)
        formData.append('authorName', authorName)
        formData.append('price', price)
        formData.append('isbnNo', isbnNo)
        formData.append('nop', nop)
        formData.append('publication', publication)
        formData.append('file', file)
        axios({
            // url: 'http://localhost:3000/add/book',
            url: apiUrl + '/add/book',
            method: 'post',
            data: formData,
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then((res) => {
            alert(res.data.message)
            navigate('/books')
        }).catch((err) => {
            alert(err)
        })

    }
    return (
        <Container className='align-items-center justify-content-center min-vh-100'>
            <Row className='w-100 justify-content-center'>
                <Col xs={12} md={6} lg={6} className='border p-4 rounded bg-white mt-5'>
                    <h2 className='text-center text-danger'>Add New Book</h2>
                    <Form>
                        <Form.Group>
                            <Form.Label>Book Title</Form.Label>
                            <Form.Control type="text" onChange={(e) => setBookTitle(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Author Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => setAuthorName(e.target.value)} ></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" onChange={(e) => setPrice(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>ISBN NO</Form.Label>
                            <Form.Control type="text" onChange={(e) => setIsbnNo(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>No Of Pages</Form.Label>
                            <Form.Control type="number" onChange={(e) => setNop(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Publication</Form.Label>
                            <Form.Control type="text" onChange={(e) => setPublication(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Select the Book Image</Form.Label>
                            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])}></Form.Control>
                        </Form.Group>
                        <Button variant="success" className='mt-3' onClick={addBook}>Add Book</Button>
                    </Form>
                </Col>

            </Row>

        </Container>
    )
}
export default AddBook