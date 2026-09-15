import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
const apiUrl = import.meta.env.VITE_API_URL

function DiscountForEdit () {
  let params = useParams()
  let id = params.id
  let navigate = useNavigate();
  let [books, setBooks] = useState([])
  let [discount, setDiscount] = useState({
    book: '',
    discountName: '',
    discountType: '',
    discountValue: 0,
    validFrom: '',
    validTo: ''
  })
  useEffect(() => {
    axios({
      url: apiUrl + '/discount/for/edit/' + id,
      method: 'get'
    })
      .then(res => {
        setDiscount(res.data.data)
        setBooks(res.data.books)
      })
      .catch(err => {
        alert(err)
      })
  }, []);
  function EditDiscount() {
    axios({
        url: apiUrl + '/edit/discount/' + id,
        method: 'put',
        data: discount
    }).then(() => {
        alert("Discount Has Been Updated SuccessFully");
        navigate('/discounts')
    }).catch((err) => {
        alert(err);
    })
  }

  function manageUpdate(e) {
    let name = e.target.name;
    let value = e.target.value;
    setDiscount((prev) => {
        return{
            ...prev,
            [name]: value
        }
    })
  }
  return (
    <Container>
      <Row>
        <Col>
          <h3 className='text-center text-danger'>Edit Discount</h3>
          <Form.Group>
            <Form.Label>Select Book</Form.Label>
            <Form.Select name='book' value={discount.book} onChange={manageUpdate}>
              {books.map(book => (
                <option value={book._id}>{book.bookTitle}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Form.Group>
          <Form.Label>Discount Name</Form.Label>
          <Form.Control
            type='text'
            name='discountName'
            value={discount.discountName} 
            onChange = { manageUpdate }
          ></Form.Control>
        </Form.Group>
      </Row>
      <Row className='mt-3'>
        <Form.Group>
          <Form.Label>Discount Type</Form.Label>
          <Form.Select name='discountType' value={discount.discountType} onChange = { manageUpdate }>
            <option value='Percentage'>Percentage</option>
            <option value='Fixed'>Fixed</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Row className='mt-3'>
        <Form.Group>
          <Form.Label>Discount Value (in Number Only)</Form.Label>
          <Form.Control
            type='number'
            name='discountValue'
            value={discount.discountValue}
            onChange = { manageUpdate }
          ></Form.Control>
        </Form.Group>
      </Row>
      <Row className='mt-3'>
        <Col>
          <Form.Group>
            <Form.Label>Valid From</Form.Label>
            <Form.Control
              type='date'
              name='validFrom'
              value={discount.validFrom.split('T')[0]}
              onChange = { manageUpdate }
            ></Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Valid To</Form.Label>
            <Form.Control
              type='date'
              name='validTo'
              value={discount.validTo.split('T')[0]}
              onChange = { manageUpdate }
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <div className='text-center mt-5'>
        <Button variant='success' onClick={EditDiscount} >
          Edit Discount
        </Button>
      </div>
    </Container>
  )
}

export default DiscountForEdit
