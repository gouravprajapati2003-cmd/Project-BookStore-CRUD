import { Container, Row, Col, Button, Badge } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct, updateQuantity } from './feactures/cart/cartSlice'
import { useNavigate } from 'react-router-dom'

function Cart () {
  const { products } = useSelector(state => state.cart)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function formatPrice (price) {
    return Number(price || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2
    })
  }

  function getQuantity (product) {
    return Math.max(1, Number(product.quantity || 1))
  }

  function getPrice (product) {
    const originalPrice = Number(product.originalPrice || 0)
    const discountValue = Number(product.discountValue || 0)

    const hasDiscount =
      product.status?.toLowerCase() === 'active' && discountValue > 0

    if (!hasDiscount) return originalPrice

    if (product.discountType === 'Percentage') {
      return Math.max(0, originalPrice - (originalPrice * discountValue) / 100)
    }

    if (product.discountType === 'Fixed') {
      return Math.max(0, originalPrice - discountValue)
    }

    return originalPrice
  }

  function increaseQuantity (product) {
    dispatch(
      updateQuantity({
        id: product._id,
        quantity: getQuantity(product) + 1
      })
    )
  }

  function decreaseQuantity (product) {
    const quantity = getQuantity(product)

    if (quantity <= 1) return

    dispatch(
      updateQuantity({
        id: product._id,
        quantity: quantity - 1
      })
    )
  }

  function deleteBookFromCart (id) {
    dispatch(deleteProduct(id))
  }

  const cartTotal = products.reduce((total, product) => {
    return total + getPrice(product) * getQuantity(product)
  }, 0)

  const totalOriginalPrice = products.reduce((total, product) => {
    return total + Number(product.originalPrice || 0) * getQuantity(product)
  }, 0)

  const totalSavings = Math.max(0, totalOriginalPrice - cartTotal)

  const totalItems = products.reduce((total, product) => {
    return total + getQuantity(product)
  }, 0)

  if (!products || products.length === 0) {
    return (
      <>
        <style>{`
          .cart-page {
            min-height: 75vh;
            background: #f5f7fa;
            display: flex;
            align-items: center;
          }

          .empty-cart-card {
            max-width: 620px;
            margin: auto;
            border: 0;
            border-radius: 20px;
            box-shadow: 0 10px 35px rgba(0,0,0,0.06);
          }

          .empty-cart-icon {
            width: 130px;
            height: 130px;
            background: #e8f5f2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: auto;
          }

          .shop-btn {
            background: #0f766e;
            border-color: #0f766e;
            border-radius: 9px;
            padding: 12px 28px;
            font-weight: 600;
          }

          .shop-btn:hover {
            background: #115e59;
            border-color: #115e59;
          }
        `}</style>

        <div className='cart-page w-100 py-5'>
          <Container>
            <div className='empty-cart-card bg-white text-center p-4 p-md-5'>
              <div className='empty-cart-icon mb-4'>
                <i
                  className='bi bi-cart-x'
                  style={{ fontSize: '65px', color: '#0f766e' }}
                />
              </div>

              <h2 className='fw-bold mb-2'>Your Cart is Empty!</h2>

              <p className='text-muted mb-4'>
                Your next favourite book is waiting for you. Explore our
                collection and add some books to your cart.
              </p>

              <Button className='shop-btn' onClick={() => navigate('/')}>
                <i className='bi bi-shop me-2' />
                Continue Shopping
              </Button>
            </div>
          </Container>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        .cart-page {
          background: #f5f7fa;
          min-height: 85vh;
          padding: 30px 0 50px;
        }

        .cart-heading {
          color: #172b4d;
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .cart-subtitle {
          color: #7b8794;
          font-size: 14px;
        }

        .cart-item-card {
          background: #fff;
          border: 1px solid #edf0f3;
          border-radius: 15px;
          padding: 18px;
          margin-bottom: 14px;
          box-shadow: 0 3px 14px rgba(0,0,0,0.025);
          transition: all 0.2s ease;
        }

        .cart-item-card:hover {
          box-shadow: 0 7px 22px rgba(0,0,0,0.06);
          border-color: #d8e9e5;
        }

        .cart-book-image {
          width: 100px;
          height: 130px;
          object-fit: contain;
          background: #f8fafc;
          border-radius: 10px;
          padding: 8px;
        }

        .cart-book-title {
          color: #263449;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.4;
        }

        .cart-author {
          color: #8993a2;
          font-size: 13px;
        }

        .cart-price {
          color: #0f766e;
          font-size: 17px;
          font-weight: 750;
        }

        .cart-old-price {
          color: #9aa3af;
          font-size: 13px;
          text-decoration: line-through;
        }

        .discount-label {
          display: inline-block;
          background: #e7f5ef;
          color: #168052;
          border-radius: 5px;
          padding: 4px 9px;
          font-size: 11px;
          font-weight: 700;
        }

        .quantity-control {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          border: 1px solid #e5e9ef;
          border-radius: 8px;
          padding: 5px 8px;
          background: #fff;
        }

        .quantity-btn {
          border: 0;
          background: #f1f5f9;
          color: #334155;
          width: 27px;
          height: 27px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #0f766e;
          color: white;
        }

        .quantity-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .quantity-number {
          font-weight: 700;
          min-width: 15px;
          text-align: center;
          color: #263449;
        }

        .remove-btn {
          color: #e05252;
          background: #fff1f1;
          border: 0;
          width: 35px;
          height: 35px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: #e05252;
          color: #fff;
        }

        .summary-card {
          background: #fff;
          border: 1px solid #edf0f3;
          border-radius: 15px;
          padding: 22px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.04);
        }

        .summary-heading {
          font-size: 18px;
          font-weight: 750;
          color: #263449;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #7b8794;
        }

        .summary-value {
          color: #263449;
          font-weight: 650;
          white-space: nowrap;
        }

        .summary-total {
          color: #0f766e;
          font-size: 21px;
          font-weight: 800;
        }

        .checkout-btn {
          background: #0f766e;
          border: 1px solid #0f766e;
          border-radius: 9px;
          padding: 12px 15px;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .checkout-btn:hover {
          background: #115e59;
          border-color: #115e59;
          transform: translateY(-1px);
        }

        .continue-btn {
          color: #0f766e;
          font-weight: 650;
          font-size: 14px;
          text-decoration: none;
        }

        .continue-btn:hover {
          color: #115e59;
        }

        .cart-benefits {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 20px;
        }

        .benefit-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border: 1px solid #edf0f3;
          border-radius: 11px;
          padding: 13px;
          min-width: 0;
        }

        .benefit-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e8f5f2;
          color: #0f766e;
          border-radius: 9px;
          font-size: 19px;
        }

        .benefit-title {
          color: #263449;
          font-size: 12px;
          font-weight: 750;
          white-space: nowrap;
        }

        .benefit-description {
          color: #8993a2;
          font-size: 10px;
          line-height: 1.4;
        }

        .secure-note {
          background: #f0f8f6;
          color: #398071;
          border-radius: 8px;
          padding: 10px;
          font-size: 12px;
        }

        .order-sidebar {
          position: sticky;
          top: 85px;
          align-self: flex-start;
        }

        @media (max-width: 991px) {
          .order-sidebar {
            position: static;
          }
        }

        @media (max-width: 767px) {
          .cart-page {
            padding: 22px 0 40px;
          }

          .cart-item-card {
            padding: 13px;
          }

          .cart-book-image {
            width: 82px;
            height: 112px;
          }

          .cart-book-title {
            font-size: 14px;
          }

          .cart-benefits {
            gap: 8px;
          }

          .benefit-card {
            padding: 10px 8px;
            gap: 7px;
          }

          .benefit-title {
            font-size: 11px;
          }

          .benefit-description {
            font-size: 9px;
          }
        }

        @media (max-width: 400px) {
          .cart-benefits {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className='cart-page'>
        <Container>
          <div className='mb-4'>
            <h2 className='cart-heading mb-1'>Shopping Cart</h2>

            <p className='cart-subtitle mb-0'>
              Review your selected books before checkout.
            </p>
          </div>

          <Row className='g-4'>
            <Col lg={8}>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <h5 className='fw-bold mb-0' style={{ color: '#263449' }}>
                  My Cart
                </h5>

                <Badge
                  bg='light'
                  className='px-3 py-2'
                  style={{
                    color: '#0f766e',
                    border: '1px solid #d8e9e5',
                    fontSize: '12px'
                  }}
                >
                  {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                </Badge>
              </div>

              {products.map(product => {
                const quantity = getQuantity(product)
                const originalPrice = Number(product.originalPrice || 0)
                const finalPrice = getPrice(product)
                const hasDiscount = finalPrice < originalPrice
                const subtotal = finalPrice * quantity

                return (
                  <div className='cart-item-card' key={product._id}>
                    <Row className='align-items-center g-3'>
                      <Col xs={4} sm={3} md={2}>
                        <img
                          src={product.bookImage}
                          alt={product.bookTittle || 'Book'}
                          className='cart-book-image'
                        />
                      </Col>

                      <Col xs={8} sm={9} md={10}>
                        <Row className='align-items-center g-3'>
                          <Col md={5}>
                            <div className='cart-book-title mb-1'>
                              {product.bookTittle ||
                                product.bookTitle ||
                                'Book'}
                            </div>

                            <div className='cart-author mb-2'>
                              <i className='bi bi-pen me-1' />
                              {product.authorName || 'Unknown Author'}
                            </div>

                            {hasDiscount && (
                              <span className='discount-label'>
                                <i className='bi bi-tag-fill me-1' />
                                {product.discountType === 'Percentage'
                                  ? `${product.discountValue}% OFF`
                                  : `₹${product.discountValue} OFF`}
                              </span>
                            )}
                          </Col>

                          <Col xs={6} md={3}>
                            <div className='cart-price'>
                              ₹{formatPrice(finalPrice)}
                            </div>

                            {hasDiscount && (
                              <div className='cart-old-price'>
                                ₹{formatPrice(originalPrice)}
                              </div>
                            )}

                            <div className='cart-author mt-1'>Per Book</div>
                          </Col>

                          <Col xs={6} md={4}>
                            <div className='d-flex flex-column align-items-start align-items-md-end'>
                              <div className='quantity-control mb-2'>
                                <button
                                  className='quantity-btn'
                                  disabled={quantity <= 1}
                                  onClick={() => decreaseQuantity(product)}
                                  aria-label='Decrease quantity'
                                >
                                  <i className='bi bi-dash-lg' />
                                </button>

                                <span className='quantity-number'>
                                  {quantity}
                                </span>

                                <button
                                  className='quantity-btn'
                                  onClick={() => increaseQuantity(product)}
                                  aria-label='Increase quantity'
                                >
                                  <i className='bi bi-plus-lg' />
                                </button>
                              </div>

                              <div
                                className='fw-bold mb-2'
                                style={{ color: '#263449' }}
                              >
                                ₹{formatPrice(subtotal)}
                              </div>

                              <button
                                className='remove-btn'
                                onClick={() => deleteBookFromCart(product._id)}
                                aria-label='Remove book from cart'
                                title='Remove book'
                              >
                                <i className='bi bi-trash3' />
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )
              })}

              <div className='mt-4 text-center'>
                <button
                  className='btn continue-btn'
                  onClick={() => navigate('/')}
                >
                  <i className='bi bi-arrow-left me-2' />
                  Continue Shopping
                </button>
              </div>

              <div className='cart-benefits'>
                <div className='benefit-card'>
                  <div className='benefit-icon'>
                    <i className='bi bi-truck' />
                  </div>

                  <div>
                    <div className='benefit-title'>Fast Delivery</div>
                    <div className='benefit-description'>
                      Books delivered to your doorstep.
                    </div>
                  </div>
                </div>

                <div className='benefit-card'>
                  <div className='benefit-icon'>
                    <i className='bi bi-shield-check' />
                  </div>

                  <div>
                    <div className='benefit-title'>Secure Payment</div>
                    <div className='benefit-description'>
                      Safe and secure transactions.
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className='order-sidebar'>
                <div className='summary-card'>
                  <h5 className='summary-heading mb-4'>
                    <i
                      className='bi bi-receipt me-2'
                      style={{ color: '#0f766e' }}
                    />
                    Order Summary
                  </h5>

                  <div className='summary-row'>
                    <span>Items ({totalItems})</span>
                    <span className='summary-value'>
                      ₹{formatPrice(totalOriginalPrice)}
                    </span>
                  </div>

                  <div className='summary-row'>
                    <span>Discount</span>
                    <span className='fw-bold text-success'>
                      - ₹{formatPrice(totalSavings)}
                    </span>
                  </div>

                  <div className='summary-row'>
                    <span>Delivery Charges</span>
                    <span className='fw-bold text-success'>FREE</span>
                  </div>

                  <hr style={{ borderColor: '#e9edf2' }} />

                  <div className='d-flex justify-content-between align-items-center mb-4'>
                    <span className='fw-bold' style={{ color: '#263449' }}>
                      Total Amount
                    </span>

                    <span className='summary-total'>
                      ₹{formatPrice(cartTotal)}
                    </span>
                  </div>

                  {totalSavings > 0 && (
                    <div className='secure-note mb-3'>
                      <i className='bi bi-check-circle-fill me-2' />
                      You saved ₹{formatPrice(totalSavings)} on this order!
                    </div>
                  )}

                  <Button
                    className='checkout-btn w-100'
                    size='lg'
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                    <i className='bi bi-arrow-right ms-2' />
                  </Button>

                  <div className='text-center mt-3'>
                    <small className='text-muted'>
                      <i className='bi bi-shield-lock me-1' />
                      Safe and Secure Checkout
                    </small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default Cart
