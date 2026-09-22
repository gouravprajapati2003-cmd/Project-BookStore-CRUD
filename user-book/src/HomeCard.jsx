import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap'
const apiUrl = import.meta.env.VITE_API_URL


function HomeCard() {
    let [books, setBooks] = useState([])
    useEffect(() => {
        axios({
            url: apiUrl + '/user/books',
            method: 'get',
        }).then((res) => {
            setBooks(res.data.data);
        }).catch((err) => {
            console.log(err);           
        })
    }, [])
    return(
        <Container fluid>
            <Row>
                {
                    books.map((book, index) => 
                    <Col key={index} lg={3} className='mt-3'>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img src={book.bookImage} height='200px' width='50px'></Card.Img>
                            <Card.Body>
                                <Card.Title>{book.bookTittle}</Card.Title>
                                <Card.Text>
                                    {book.authorName}<br></br>
                                    &#x20b9;{book.originalPrice}<br></br>
                                    {book.publicationYear}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    )
                }
            </Row>
        </Container>
    )
}

export default HomeCard;