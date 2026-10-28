// import { Container, Row, Col, Button } from 'react-bootstrap'
// import { useSelector, useDispatch } from 'react-redux'
// import { deleteProduct } from './feactures/cart/cartSlice'
// import { useNavigate } from 'react-router-dom'

// function Cart () {
//   const { products, totalCost } = useSelector(state => state.cart)
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   function deleteBookFromCart (id) {
//     dispatch(deleteProduct(id))
//   }
//   function goToCheckoutPage() {
//     navigate('/checkout')
//   }
//   return (
//     <Container>
//       <Row>
//         <Col>
//           <h3 className='mt-3 text-center text-danger'>Shopping Cart</h3>
//           <table className='table mt-5'>
//             <thead>
//               <tr>
//                 <th>Book Image</th>
//                 <th>Book Name</th>
//                 <th>Author Name</th>
//                 <th>Price</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map(product => (
//                 <tr>
//                   <td>
//                     <img
//                       src={product.bookImage}
//                       heigth='30px'
//                       width='30px'
//                     ></img>
//                   </td>
//                   <td>{product.bookTittle}</td>
//                   <td>{product.authorName}</td>
//                   <td>₹ {product.originalPrice}</td>
//                   <td>
//                     <i
//                       className='bi bi-trash text-danger'
//                       onClick={() => deleteBookFromCart(product._id)}
//                     ></i>
//                   </td>
//                 </tr>
//               ))}
//               <tr>
//                 <td></td>
//                 <td></td>
//                 <td>Total Cost</td>
//                 <td colSpan={2}>₹ {totalCost}</td>
//               </tr>
//             </tbody>
//           </table>
//               <Button
//                 style={{ width: '250px', float: 'right' }}
//                 size='lg'
//                 variant='warning'
//                 className='mt-2' onClick={goToCheckoutPage}>
//                 Procced For Checkout
//               </Button>
//         </Col>
//       </Row>
//     </Container>
//   )
// }
// export default Cart


import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct } from './feactures/cart/cartSlice'
import { useNavigate } from 'react-router-dom'

function Cart () {
  const { products, totalCost } = useSelector(state => state.cart)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function deleteBookFromCart (id) {
    dispatch(deleteProduct(id))
  }

  function goToCheckoutPage () {
    navigate('/checkout')
  }

  function startShopping () {
    navigate('/')
  }

  // Empty Cart UI
  if (!products || products.length === 0) {
    return (
      <Container className='py-5'>
        <Row className='justify-content-center'>
          <Col xs={12} md={8} lg={6}>
            <div
              className='bg-white text-center rounded shadow-sm p-4 p-md-5'
              style={{ minHeight: '350px' }}
            >
              <div
                className='d-flex align-items-center justify-content-center mx-auto mb-4'
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f5ff'
                }}
              >
                <i
                  className='bi bi-cart-x'
                  style={{
                    fontSize: '75px',
                    color: '#2874f0'
                  }}
                ></i>
              </div>

              <h3 className='fw-bold mb-2'>Your cart is empty!</h3>

              <p className='text-muted mb-4'>
                Looks like you haven't added any books to your cart yet. Explore
                our bookstore and find your next favourite book.
              </p>

              <Button
                variant='primary'
                size='lg'
                className='px-4 fw-semibold'
                onClick={startShopping}
                style={{
                  backgroundColor: '#2874f0',
                  borderColor: '#2874f0'
                }}
              >
                <i className='bi bi-shop me-2'></i>
                Start Shopping
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }

  // Cart with products
  return (
    <Container className='py-3'>
      <Row>
        <Col>
          <h3 className='mt-3 text-center text-danger'>Shopping Cart</h3>

          <div className='table-responsive'>
            <table className='table table-hover align-middle mt-4'>
              <thead className='table-light'>
                <tr>
                  <th>Book Image</th>
                  <th>Book Name</th>
                  <th>Author Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.bookImage}
                        alt={product.bookTittle || 'Book'}
                        width='55'
                        height='65'
                        style={{ objectFit: 'contain' }}
                      />
                    </td>

                    <td>{product.bookTittle || product.bookTitle || 'Book'}</td>

                    <td>{product.authorName || 'N/A'}</td>

                    <td>
                      ₹
                      {Number(product.originalPrice || 0).toLocaleString(
                        'en-IN'
                      )}
                    </td>

                    <td>
                      <Button
                        variant='link'
                        className='p-0'
                        aria-label='Remove book from cart'
                        onClick={() => deleteBookFromCart(product._id)}
                      >
                        <i className='bi bi-trash text-danger fs-5'></i>
                      </Button>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={3} className='text-end fw-bold'>
                    Total Cost
                  </td>

                  <td colSpan={2} className='fw-bold'>
                    ₹{Number(totalCost || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='d-flex justify-content-end mt-3'>
            <Button
              style={{ minWidth: '250px' }}
              size='lg'
              variant='warning'
              className='fw-semibold'
              onClick={goToCheckoutPage}
            >
              Proceed to Checkout
              <i className='bi bi-arrow-right ms-2'></i>
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Cart
