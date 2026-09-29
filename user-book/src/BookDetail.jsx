// import { useParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// const apiUrl = import.meta.env.VITE_API_URL
// import axios from 'axios'
// import { Container, Row, Col, Button } from 'react-bootstrap'
// function BookDetail(){
//     let [book, setBook] = useState({})
//     let params = useParams();
//     let id = params.id;
//     useEffect(()=>{
//         axios({
//             url : apiUrl + '/user/book/' + id,
//             method : 'get'
//         }) .then((res)=>{
//             setBook(res.data.data)
//         }) .catch((err)=>{
//             console.log(err)
//         })
//     }, [])
//     return(
//        <Container>
//         <Row className = 'mt-5'>
//             <Col lg={4}>
//             <img src={book.bookImage} height="300px" width="300px"></img>
//             <Button className='mt-3' style={{ width: '300px' }} size='lg' variant='warning'>Add To Cart</Button>
//             </Col>
//             <Col>
//                 <h5 style={{ color: 'dark'}}>{book.bookTittle}</h5>
//                 <h6 style={{ color: 'grey'}}>AuthorName: {book.authorName}, (ISBN No: {book.isbnNo})</h6>
//                 <h4>Product Highlights</h4>
//                 <h5>Price:<span className='ms-1' style={{ color:'grey' }}>&#x20b9;{book.originalPrice}</span></h5>
//                 <h5>Short Description:<span className='ms-1' style={{ color:'grey' }}>{book.shortDescription}</span></h5>
//                 <h5>Long Description:<span className='ms-1' style={{ color:'grey' }}>{book.description}</span></h5>
//                 <h5>Published By:<span className='ms-1' style={{ color:'grey' }}>{book.publisher}</span></h5>
//                 <h5>Publication Year:<span className='ms-1' style={{ color:'grey' }}>{book.publicationYear}</span></h5>
//                 <h5>Edition:<span className='ms-1' style={{ color:'grey' }}>{book.edition}</span></h5>
//             </Col>
//         </Row>
//        </Container>
//     )
// }
// export default BookDetail

import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const apiUrl = import.meta.env.VITE_API_URL
import axios from 'axios'
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap'
function BookDetail () {
  const navigate = useNavigate()
  let [book, setBook] = useState({})
  let params = useParams()
  let id = params.id
  useEffect(() => {
    axios({
      url: apiUrl + '/user/book/' + id,
      method: 'get'
    })
      .then(res => {
        setBook(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <Container className='py-4'>
      {/* Back Button */}
      <Button variant='dark' className='mb-4' onClick={() => navigate('/')}>
        ← Back
      </Button>
      {/* Main Book Card */}
      <Card className='shadow-sm border-1'>
        <Card.Body>
          <Row>
            <Col md={4} className='text-center'>
              {book.bookImage ? (
                <img
                  src={book.bookImage}
                  alt={book.bookTittle}
                  className='img-fluid'
                  style={{
                    width: '100%',
                    maxWidth: '350px',
                    height: '450px',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div
                  className='d-flex align-items-center justify-content-center border rounded'
                  style={{
                    width: '100%',
                    maxWidth: '350px',
                    height: '450px',
                    margin: 'auto'
                  }}
                >
                  No Image
                </div>
              )}
              <Button
                className='mt-4'
                style={{ width: '345px' }}
                size='lg'
                variant='warning'
              >
                Add To Cart
              </Button>
            </Col>
            <Col md={8}>
              <h2 className='fw-bold'>{book.bookTittle || '-'}</h2>

              <p className='text-muted fs-5'>By {book.authorName || '-'}</p>

              <hr />
              <div className='mb-4'>
                <h4 className='fw-bold text-success'>
                  ₹{book.originalPrice || '-'}
                </h4>
              </div>

              {book.shortDescription && (
                <div className='mb-4'>
                  <h5 className='fw-bold'>About this book</h5>

                  <p>{book.shortDescription}</p>
                </div>
              )}
              <h5 className='fw-bold mb-3'>Book Details</h5>

              <BookDetailLocal label='Author' value={book.authorName} />

              <BookDetailLocal label='Imprint' value={book.imprint} />

              <BookDetailLocal label='Publisher' value={book.publisher} />

              <BookDetailLocal
                label='Publication Year'
                value={book.publicationYear}
              />

              <BookDetailLocal label='ISBN' value={book.isbnNo} />

              <BookDetailLocal label='Edition' value={book.edition} />

              <BookDetailLocal label='Language' value={book.language} />

              <BookDetailLocal label='Genre' value={book.genre} />

              <BookDetailLocal label='Category' value={book.bookCategory} />

              <BookDetailLocal label='Rating' value={book.rating} />

              <BookDetailLocal label='Reviews' value={book.reviews} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <div className='d-flex align-items-center justify-content-end gap-3 mt-3'>
        {/* Pincode Section */}
        <div className='d-flex align-items-center gap-2'>
          <h6 className='mb-0'>Check Delivery:</h6>

          <Form.Control
            type='text'
            placeholder='Enter Pincode'
            maxLength={6}
            style={{ width: '180px' }}
          />

          <Button variant='primary'>Check</Button>
        </div>

        {/* Add To Cart */}
        <Button style={{ width: '180px' }} size='lg' variant='warning'>
          Add To Cart
        </Button>

        {/* Buy Now */}
        <Button style={{ width: '180px' }} size='lg' variant='primary'>
          Buy Now
        </Button>
      </div>
      
      {/* DESCRIPTION */}
      {book.description && (
        <Card className='shadow-sm border-1 mt-4'>
          <Card.Body>
            <h4 className='fw-bold'>Description</h4>

            <p className='mt-3'>{book.description}</p>
          </Card.Body>
        </Card>
      )}
      <Card className='shadow-sm border-1 mt-4'>
        <Card.Body>
          <h4 className='fw-bold mb-3'>Product Highlights</h4>

          <BookDetailLocal
            label='Country of Origin'
            value={book.countryOfOrigin}
          />

          <BookDetailLocal label='Product From' value={book.productFrom} />

          <BookDetailLocal
            label='Manufacturer'
            value={book.nameOfManufacturer}
          />

          <BookDetailLocal
            label='Manufacturer Address'
            value={book.addressOfManufacturer}
          />

          <BookDetailLocal label='Packager' value={book.nameOfPackager} />

          <BookDetailLocal
            label='Packager Address'
            value={book.addressOfPackager}
          />
        </Card.Body>
      </Card>
    </Container>
  )
}

function BookDetailLocal ({ label, value }) {
  return (
    <Row className='border-bottom py-2'>
      <Col xs={5} className='text-muted'>
        {label}
      </Col>

      <Col xs={7} className='fw-semibold'>
        {value || '-'}
      </Col>
    </Row>
  )
}

export default BookDetail
