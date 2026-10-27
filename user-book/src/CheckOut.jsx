import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCart } from './feactures/cart/cartSlice'
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
const apiUrl = import.meta.env.VITE_API_URL

function CheckOut () {
  const { products, totalCost } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  let navigate = useNavigate()
  let [firstName, setFirstName] = useState('')
  let [lastName, setLastName] = useState('')
  let [email, setEmail] = useState('')
  let [mobileNo, setMobileNo] = useState('')
  let [addressLine1, setAddressLine1] = useState('')
  let [addressLine2, setaddressLine2] = useState('')
  let [city, setCity] = useState('')
  let [state, setState] = useState('')
  let [country, setCountry] = useState('')
  let [pinCode, setPinCode] = useState('')
  // let [amount, setAmount] = useState(0)
  function deleteCartOnPaymentSuccess () {
    dispatch(deleteCart())
  }
  const loadScript = src => {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.src = src

      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }
  async function goForPayment () {
    let data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobileNo: mobileNo,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      country: country,
      pinCode: pinCode,
      products: products,
      amount: totalCost
    }
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if (!res) {
      alert('unable to load window')
      return
    }
    const response = await fetch(apiUrl + '/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const orderData = await response.json()
    const options = {
      key: razorpayKey, // test_key is here
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'G.K.P. Book Store',
      description: 'Payment for Book',
      order_id: orderData.id,
      handler: async function (response) {
        // स्टेप 4: पेमेंट सफल होने पर बैकएंड पर वेरिफिकेशन भेजें
        const verifyResponse = await fetch(apiUrl + '/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        })
        const verifyData = await verifyResponse.json()
        if (verifyResponse.ok) {
          alert('Payment has been done successfully')
          {deleteCartOnPaymentSuccess()}
          navigate('/payment/success', { state: verifyData.data })
        } else {
          alert('Verification Failed: ' + verifyData.message)
          navigate('/payment/fail')
        }
      },
      prefill: {
        name: 'GouravKumar',
        email: 'gkp@bookstore.com',
        contact: '81xxxxxx32'
      },
      theme: { color: '#3399cc' }
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }
  return (
    <Container>
      <Row>
        <Col>
          <h4 className='text-center text-danger mt-5'>Shipping Details</h4>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setFirstName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setLastName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    onChange={e => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Mobile No.</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setMobileNo(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <h5 className='mt-3 text-primary'>Shipping Address</h5>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setAddressLine1(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setaddressLine2(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setCity(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setState(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setCountry(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Pin Code</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setPinCode(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col>
          <h4 className='text-center text-danger mt-5'>Product Summary</h4>
          <table className='table mt-2'>
            <thead>
              <tr>
                <th>Book Image</th>
                <th>Book Name</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.bookImage}
                      heigth='30px'
                      width='30px'
                    ></img>
                  </td>
                  <td>{product.bookTittle}</td>
                  <td>₹ {product.originalPrice}</td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td>Total Cost</td>
                <td colSpan={2}>₹ {totalCost}</td>
              </tr>
            </tbody>
          </table>
          <Button
            style={{ width: '150px', float: 'right' }}
            size='lg'
            variant='warning'
            className='mt-2'
            onClick={goForPayment}
          >
            Pay Now
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default CheckOut
