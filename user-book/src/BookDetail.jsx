import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
const apiURL = import.meta.env.VITE_API_URL
import axios from 'axios'
import { Container, Row, Col, Button } from 'react-bootstrap'
function BookDetail(){
    let [book, setBook] = useState({})
    let params = useParams();
    let id = params.id;
    useEffect(()=>{
        axios({
            url : apiURL + '/user/book/' + id,
            method : 'get'
        }) .then((res)=>{
            setBook(res.data.data)
        }) .catch((err)=>{
            console.log(err)
        })
    }, [])
    return(
       <Container>
        <Row className = 'mt-5'>
            <Col lg={4}>
            <img src={book.bookImage} height="300px" width="300px"></img>
            <Button className='mt-3' style={{ width: '300px' }} size='lg' variant='warning'>Add To Cart</Button>
            </Col>
            <Col>
                <h5 style={{ color: 'dark'}}>{book.bookTittle}</h5>
                <h6 style={{ color: 'grey'}}>AuthorName: {book.authorName}, (ISBN No: {book.isbnNo})</h6>
                <h4>Product Highlights</h4>
                <h5>Price:<span className='ms-1' style={{ color:'grey' }}>&#x20b9;{book.originalPrice}</span></h5>
                <h5>Short Description:<span className='ms-1' style={{ color:'grey' }}>{book.shortDescription}</span></h5>
                <h5>Long Description:<span className='ms-1' style={{ color:'grey' }}>{book.description}</span></h5>
                <h5>Published By:<span className='ms-1' style={{ color:'grey' }}>{book.publisher}</span></h5>
                <h5>Publication Year:<span className='ms-1' style={{ color:'grey' }}>{book.publicationYear}</span></h5>
                <h5>Edition:<span className='ms-1' style={{ color:'grey' }}>{book.edition}</span></h5>
            </Col>
        </Row>
       </Container>
    )
}
export default BookDetail