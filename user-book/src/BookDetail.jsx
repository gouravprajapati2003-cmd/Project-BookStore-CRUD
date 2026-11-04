// // import 'bootstrap/dist/css/bootstrap.min.css'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import { useEffect, useState } from 'react'
// // import { useDispatch, useSelector } from 'react-redux'
// // import { addProduct, clearCartMessage } from './feactures/cart/cartSlice'
// // import axios from 'axios'
// // import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap'

// // const apiUrl = import.meta.env.VITE_API_URL

// // function BookDetail () {
// //   const navigate = useNavigate()
// //   const { id } = useParams()
// //   const dispatch = useDispatch()

// //   // Book state
// //   const [book, setBook] = useState({})

// //   // Cart message from Redux
// //   const cartMessage = useSelector(state => state.cart.message)

// //   // Pincode state
// //   const [pincode, setPincode] = useState('')
// //   const [pincodeMsg, setPincodeMsg] = useState('')
// //   const [pincodeLoading, setPincodeLoading] = useState(false)
// //   const [pincodeAvailable, setPincodeAvailable] = useState(null)

// //   // Get Book Details
// //   useEffect(() => {
// //     axios
// //       .get(`${apiUrl}/user/book/${id}`)
// //       .then(res => {
// //         setBook(res.data.data || {})
// //         dispatch(clearCartMessage())
// //       })
// //       .catch(err => {
// //         console.log('Book fetch error:', err)
// //       })
// //   }, [id, dispatch])

// //   // Add To Cart
// //   const addToCart = () => {
// //     if (!book._id) return

// //     dispatch(addProduct(book))
// //   }

// //   // Check Pincode
// //   const checkPincode = async () => {
// //     setPincodeMsg('')
// //     setPincodeAvailable(null)

// //     const enteredPincode = pincode.trim()

// //     // Validate 6 digit pincode
// //     if (!/^[0-9]{6}$/.test(enteredPincode)) {
// //       setPincodeMsg('Please enter a valid 6-digit pincode')
// //       setPincodeAvailable(false)
// //       return
// //     }

// //     setPincodeLoading(true)

// //     try {
// //       const res = await axios.post(
// //         `${apiUrl}/check/book/pincode`,
// //         {
// //           book: id,
// //           pinCode: enteredPincode
// //         }
// //       )

// //       const responseData = res.data

// //       const availability =
// //         responseData?.data?.isAvailable ??
// //         responseData?.isAvailable ??
// //         responseData?.data?.available

// //       setPincodeAvailable(availability === true)

// //       if (availability === true) {
// //         setPincodeMsg(
// //           responseData?.message ||
// //           'Delivery is available at this pincode'
// //         )
// //       } else {
// //         setPincodeMsg(
// //           responseData?.message ||
// //           'Delivery not available at this pincode'
// //         )
// //       }
// //     } catch (err) {
// //       console.log('Pincode check error:', err)

// //       setPincodeAvailable(false)

// //       if (err.response?.data?.message) {
// //         setPincodeMsg(err.response.data.message)
// //       } else {
// //         setPincodeMsg('Delivery not available at this pincode')
// //       }
// //     } finally {
// //       setPincodeLoading(false)
// //       setPincode('')
// //     }
// //   }
// //   function buyNow() {
// //     dispatch(addProduct(book))
// //     navigate('/checkout')
// //   }

// //   return (
// //     <Container className='py-4'>
// //       {/* Back Button */}
// //       <Button
// //         variant='dark'
// //         className='mb-4'
// //         onClick={() => navigate('/')}
// //       >
// //         ← Back
// //       </Button>

// //       {/* Main Book Card */}
// //       <Card className='shadow-sm border-1'>
// //         <Card.Body>
// //           <Row>
// //             {/* Book Image */}
// //             <Col md={4} className='text-center'>
// //               {book.bookImage ? (
// //                 <img
// //                   src={book.bookImage}
// //                   alt={book.bookTittle || 'Book'}
// //                   className='img-fluid'
// //                   style={{
// //                     width: '100%',
// //                     maxWidth: '350px',
// //                     height: '450px',
// //                     objectFit: 'contain'
// //                   }}
// //                 />
// //               ) : (
// //                 <div
// //                   className='d-flex align-items-center justify-content-center border rounded'
// //                   style={{
// //                     width: '100%',
// //                     maxWidth: '350px',
// //                     height: '450px',
// //                     margin: 'auto'
// //                   }}
// //                 >
// //                   No Image
// //                 </div>
// //               )}

// //               <Button
// //                 className='mt-4'
// //                 style={{ width: '100%', maxWidth: '345px' }}
// //                 size='lg'
// //                 variant='warning'
// //                 onClick={addToCart}
// //               >
// //                 Add To Cart
// //               </Button>

// //               {/* Cart Message */}
// //               {cartMessage && (
// //                 <div
// //                   className={
// //                     cartMessage === 'Item already added to cart'
// //                       ? 'text-danger mt-2 fw-semibold'
// //                       : 'text-success mt-2 fw-semibold'
// //                   }
// //                 >
// //                   {cartMessage}
// //                 </div>
// //               )}
// //             </Col>

// //             {/* Book Information */}
// //             <Col md={8}>
// //               <h2 className='fw-bold'>
// //                 {book.bookTittle || '-'}
// //               </h2>

// //               <p className='text-muted fs-5'>
// //                 By {book.authorName || '-'}
// //               </p>

// //               <hr />

// //               {/* Price */}
// //               <div className='mb-4'>
// //                 <h4 className='fw-bold text-success'>
// //                   ₹{book.originalPrice ?? '-'}
// //                 </h4>
// //               </div>

// //               {/* Short Description */}
// //               {book.shortDescription && (
// //                 <div className='mb-4'>
// //                   <h5 className='fw-bold'>About this book</h5>
// //                   <p>{book.shortDescription}</p>
// //                 </div>
// //               )}

// //               {/* Book Details */}
// //               <h5 className='fw-bold mb-3'>Book Details</h5>

// //               <BookDetailLocal
// //                 label='Author'
// //                 value={book.authorName}
// //               />

// //               <BookDetailLocal
// //                 label='Imprint'
// //                 value={book.imprint}
// //               />

// //               <BookDetailLocal
// //                 label='Publisher'
// //                 value={book.publisher}
// //               />

// //               <BookDetailLocal
// //                 label='Publication Year'
// //                 value={book.publicationYear}
// //               />

// //               <BookDetailLocal
// //                 label='ISBN'
// //                 value={book.isbnNo}
// //               />

// //               <BookDetailLocal
// //                 label='Edition'
// //                 value={book.edition}
// //               />

// //               <BookDetailLocal
// //                 label='Language'
// //                 value={book.language}
// //               />

// //               <BookDetailLocal
// //                 label='Genre'
// //                 value={book.genre}
// //               />

// //               <BookDetailLocal
// //                 label='Category'
// //                 value={book.bookCategory}
// //               />

// //               <BookDetailLocal
// //                 label='Rating'
// //                 value={book.rating}
// //               />

// //               <BookDetailLocal
// //                 label='Reviews'
// //                 value={book.reviews}
// //               />
// //             </Col>
// //           </Row>
// //         </Card.Body>
// //       </Card>

// //       {/* Pincode + Cart + Buy Now */}
// //       <Row className='align-items-start justify-content-end g-3 mt-2'>
// //         {/* Pincode Section */}
// //         <Col xs={12} lg='auto'>
// //           <Form
// //             onSubmit={e => {
// //               e.preventDefault()
// //               checkPincode()
// //             }}
// //           >
// //             <div className='d-flex align-items-center gap-2 flex-wrap'>
// //               <h5 className='mb-0'>Check Delivery:</h5>

// //               <Form.Control
// //                 type='text'
// //                 inputMode='numeric'
// //                 autoComplete='postal-code'
// //                 placeholder='Enter Pincode'
// //                 value={pincode}
// //                 maxLength={6}
// //                 style={{ width: '180px' }}
// //                 onChange={e => {
// //                   const value = e.target.value
// //                     .replace(/[^0-9]/g, '')
// //                     .slice(0, 6)

// //                   setPincode(value)
// //                   setPincodeMsg('')
// //                   setPincodeAvailable(null)
// //                 }}
// //               />

// //               <Button
// //                 type='submit'
// //                 variant='primary'
// //                 disabled={pincodeLoading}
// //               >
// //                 {pincodeLoading ? 'Checking...' : 'Check'}
// //               </Button>
// //             </div>

// //             {/* Pincode Message */}
// //             {pincodeMsg && (
// //               <div className='mt-2'>
// //                 <small
// //                   className={
// //                     pincodeAvailable === true
// //                       ? 'fw-semibold text-success'
// //                       : 'fw-semibold text-danger'
// //                   }
// //                   role='status'
// //                 >
// //                   {pincodeMsg}
// //                 </small>
// //               </div>
// //             )}
// //           </Form>
// //         </Col>

// //         {/* Add To Cart */}
// //         <Col xs={12} sm='auto'>
// //           <Button
// //             className='w-100'
// //             style={{ minWidth: '180px' }}
// //             size='lg'
// //             variant='warning'
// //             onClick={addToCart}
// //           >
// //             Add To Cart
// //           </Button>
// //         </Col>

// //         {/* Buy Now */}
// //         <Col xs={12} sm='auto'>
// //           <Button
// //             className='w-100'
// //             style={{ minWidth: '180px' }}
// //             size='lg'
// //             variant='success'
// //             onClick={buyNow}
// //           >
// //             Buy Now
// //           </Button>
// //         </Col>
// //       </Row>

// //       {/* Description */}
// //       {book.description && (
// //         <Card className='shadow-sm border-1 mt-4'>
// //           <Card.Body>
// //             <h4 className='fw-bold'>Description</h4>
// //             <p className='mt-3'>{book.description}</p>
// //           </Card.Body>
// //         </Card>
// //       )}

// //       {/* Product Highlights */}
// //       <Card className='shadow-sm border-1 mt-4'>
// //         <Card.Body>
// //           <h4 className='fw-bold mb-3'>Product Highlights</h4>

// //           <BookDetailLocal
// //             label='Country of Origin'
// //             value={book.countryOfOrigin}
// //           />

// //           <BookDetailLocal
// //             label='Product From'
// //             value={book.productFrom}
// //           />

// //           <BookDetailLocal
// //             label='Manufacturer'
// //             value={book.nameOfManufacturer}
// //           />

// //           <BookDetailLocal
// //             label='Manufacturer Address'
// //             value={book.addressOfManufacturer}
// //           />

// //           <BookDetailLocal
// //             label='Packager'
// //             value={book.nameOfPackager}
// //           />

// //           <BookDetailLocal
// //             label='Packager Address'
// //             value={book.addressOfPackager}
// //           />
// //         </Card.Body>
// //       </Card>
// //     </Container>
// //   )
// // }

// // // Reusable Book Detail Row
// // function BookDetailLocal ({ label, value }) {
// //   return (
// //     <Row className='border-bottom py-2'>
// //       <Col xs={5} className='text-muted'>
// //         {label}
// //       </Col>

// //       <Col xs={7} className='fw-semibold'>
// //         {value ?? '-'}
// //       </Col>
// //     </Row>
// //   )
// // }

// // export default BookDetail



// import 'bootstrap/dist/css/bootstrap.min.css'
// import { useParams, useNavigate } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { addProduct, clearCartMessage } from './feactures/cart/cartSlice'
// import axios from 'axios'
// import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap'
// import {
//   FaArrowLeft,
//   FaShoppingBag,
//   FaBolt,
//   FaTruck,
//   FaShieldAlt,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaMapMarkerAlt
// } from 'react-icons/fa'

// const apiUrl = import.meta.env.VITE_API_URL

// function BookDetail () {
//   const navigate = useNavigate()
//   const { id } = useParams()
//   const dispatch = useDispatch()

//   const [book, setBook] = useState({})
//   const [loading, setLoading] = useState(true)

//   const cartMessage = useSelector(state => state.cart.message)

//   const [pincode, setPincode] = useState('')
//   const [pincodeMsg, setPincodeMsg] = useState('')
//   const [pincodeLoading, setPincodeLoading] = useState(false)
//   const [pincodeAvailable, setPincodeAvailable] = useState(null)

//   useEffect(() => {
//     setLoading(true)

//     axios
//       .get(`${apiUrl}/user/book/${id}`)
//       .then(res => {
//         setBook(res.data.data || {})
//         dispatch(clearCartMessage())
//       })
//       .catch(err => console.log(err))
//       .finally(() => setLoading(false))
//   }, [id, dispatch])

//   const addToCart = () => {
//     if (!book._id) return
//     dispatch(addProduct(book))
//   }

//   const buyNow = () => {
//     if (!book._id) return
//     dispatch(addProduct(book))
//     navigate('/checkout')
//   }

//   const checkPincode = async () => {
//     setPincodeMsg('')
//     setPincodeAvailable(null)

//     if (!/^[0-9]{6}$/.test(pincode.trim())) {
//       setPincodeMsg('Please enter a valid 6-digit pincode')
//       setPincodeAvailable(false)
//       return
//     }

//     setPincodeLoading(true)

//     try {
//       const res = await axios.post(`${apiUrl}/check/book/pincode`, {
//         book: id,
//         pinCode: pincode.trim()
//       })

//       const data = res.data

//       const available =
//         data?.data?.isAvailable ?? data?.isAvailable ?? data?.data?.available

//       setPincodeAvailable(available === true)

//       setPincodeMsg(
//         data?.message ||
//           (available === true
//             ? 'Delivery is available at this pincode'
//             : 'Delivery not available at this pincode')
//       )
//     } catch (err) {
//       setPincodeAvailable(false)
//       setPincodeMsg(
//         err.response?.data?.message || 'Delivery not available at this pincode'
//       )
//     } finally {
//       setPincodeLoading(false)
//       setPincode('')
//     }
//   }

//   const detailItems = [
//     ['Author', book.authorName],
//     ['Publisher', book.publisher],
//     ['Imprint', book.imprint],
//     ['Publication Year', book.publicationYear],
//     ['ISBN Number', book.isbnNo],
//     ['Edition', book.edition],
//     ['Language', book.language],
//     ['Genre', book.genre],
//     ['Category', book.bookCategory],
//     ['Rating', book.rating],
//     ['Reviews', book.reviews]
//   ]

//   const highlightItems = [
//     ['Country of Origin', book.countryOfOrigin],
//     ['Product From', book.productFrom],
//     ['Manufacturer', book.nameOfManufacturer],
//     ['Manufacturer Address', book.addressOfManufacturer],
//     ['Packager', book.nameOfPackager],
//     ['Packager Address', book.addressOfPackager]
//   ]

//   if (loading) {
//     return (
//       <div
//         className='d-flex justify-content-center align-items-center'
//         style={{ minHeight: '70vh', background: '#F5F1E9' }}
//       >
//         <Spinner animation='border' style={{ color: '#526B57' }} />
//       </div>
//     )
//   }

//   if (!book._id) {
//     return (
//       <Container className='py-5 text-center'>
//         <h4>Book not found</h4>
//         <Button onClick={() => navigate('/')}>Back to Store</Button>
//       </Container>
//     )
//   }

//   return (
//     <div
//       style={{
//         background: '#F5F1E9',
//         minHeight: '100vh',
//         color: '#29382F'
//       }}
//     >
//       <Container className='py-4 py-md-5'>
//         <div className='d-flex justify-content-between align-items-center mb-4'>
//           <div>
//             <div
//               className='fw-bold'
//               style={{
//                 fontSize: '22px',
//                 letterSpacing: '1px',
//                 color: '#29382F'
//               }}
//             >
//               G.K.P. <span style={{ color: '#A17B51' }}>BOOKSTORE</span>
//             </div>
//             <small
//               style={{
//                 color: '#8A8173',
//                 letterSpacing: '3px',
//                 fontSize: '9px'
//               }}
//             >
//               BOOKS THAT INSPIRE
//             </small>
//           </div>

//           <Button
//             variant='light'
//             className='rounded-circle border-0'
//             style={{
//               width: '42px',
//               height: '42px',
//               background: '#EAE4D8',
//               color: '#29382F'
//             }}
//             onClick={() => navigate('/')}
//           >
//             <FaArrowLeft />
//           </Button>
//         </div>

//         <div
//           className='mb-4'
//           style={{
//             fontSize: '11px',
//             color: '#948879',
//             letterSpacing: '1px'
//           }}
//         >
//           HOME / BOOK COLLECTION / BOOK DETAILS
//         </div>

//         <div
//           className='p-3 p-md-4 p-lg-5'
//           style={{
//             background: '#FFFEFB',
//             border: '1px solid #E9E1D5',
//             borderRadius: '5px'
//           }}
//         >
//           <Row className='g-4 g-lg-5'>
//             <Col lg={5}>
//               <div
//                 className='d-flex justify-content-center align-items-center p-3 p-md-4'
//                 style={{
//                   background: '#F0EBE2',
//                   minHeight: '420px'
//                 }}
//               >
//                 {book.bookImage ? (
//                   <img
//                     src={book.bookImage}
//                     alt={book.bookTittle}
//                     style={{
//                       width: '100%',
//                       maxWidth: '310px',
//                       height: '420px',
//                       objectFit: 'contain',
//                       filter: 'drop-shadow(8px 12px 12px rgba(0,0,0,0.16))'
//                     }}
//                   />
//                 ) : (
//                   <div className='text-secondary'>No Image Available</div>
//                 )}
//               </div>

//               <div
//                 className='text-center mt-3'
//                 style={{
//                   color: '#948879',
//                   fontSize: '10px',
//                   letterSpacing: '2px'
//                 }}
//               >
//                 A WORLD OF KNOWLEDGE IN EVERY PAGE
//               </div>
//             </Col>

//             <Col lg={7}>
//               <div className='h-100 d-flex flex-column'>
//                 <div
//                   className='mb-3'
//                   style={{
//                     color: '#A17B51',
//                     fontSize: '11px',
//                     letterSpacing: '2px',
//                     textTransform: 'uppercase'
//                   }}
//                 >
//                   {book.bookCategory || 'BOOK COLLECTION'}
//                 </div>

//                 <h1
//                   className='fw-bold mb-2'
//                   style={{
//                     color: '#29382F',
//                     fontSize: 'clamp(27px, 3.5vw, 39px)',
//                     lineHeight: '1.25',
//                     fontFamily: 'Georgia, serif'
//                   }}
//                 >
//                   {book.bookTittle}
//                 </h1>

//                 <p
//                   className='mb-4'
//                   style={{
//                     color: '#8A8173',
//                     fontSize: '15px'
//                   }}
//                 >
//                   Written by{' '}
//                   <span style={{ color: '#526B57' }}>
//                     {book.authorName || '-'}
//                   </span>
//                 </p>

//                 <div
//                   className='py-3 mb-4'
//                   style={{
//                     borderTop: '1px solid #E9E1D5',
//                     borderBottom: '1px solid #E9E1D5'
//                   }}
//                 >
//                   <div className='d-flex align-items-center gap-3'>
//                     <h2
//                       className='fw-bold mb-0'
//                       style={{
//                         color: '#526B57',
//                         fontSize: '30px'
//                       }}
//                     >
//                       ₹{book.originalPrice ?? '-'}
//                     </h2>
//                     <span
//                       style={{
//                         color: '#948879',
//                         fontSize: '12px'
//                       }}
//                     >
//                       Inclusive of all taxes
//                     </span>
//                   </div>
//                 </div>

//                 {book.shortDescription && (
//                   <div className='mb-4'>
//                     <h6
//                       className='fw-bold mb-2'
//                       style={{
//                         fontFamily: 'Georgia, serif',
//                         color: '#29382F'
//                       }}
//                     >
//                       About this book
//                     </h6>
//                     <p
//                       className='mb-0'
//                       style={{
//                         color: '#77766E',
//                         lineHeight: '1.9',
//                         fontSize: '14px'
//                       }}
//                     >
//                       {book.shortDescription}
//                     </p>
//                   </div>
//                 )}

//                 <div className='mb-4'>
//                   <h6
//                     className='fw-bold mb-3'
//                     style={{
//                       fontFamily: 'Georgia, serif',
//                       color: '#29382F'
//                     }}
//                   >
//                     Book Details
//                   </h6>

//                   <div
//                     style={{
//                       borderTop: '1px solid #E9E1D5'
//                     }}
//                   >
//                     {detailItems.map(([label, value]) => (
//                       <DetailRow key={label} label={label} value={value} />
//                     ))}
//                   </div>
//                 </div>

//                 <div className='mt-auto'>
//                   <div
//                     className='p-3 mb-3'
//                     style={{
//                       background: '#F5F1E9',
//                       border: '1px solid #E9E1D5'
//                     }}
//                   >
//                     <div className='d-flex align-items-center gap-2 mb-3'>
//                       <FaMapMarkerAlt style={{ color: '#A17B51' }} />
//                       <span
//                         className='fw-semibold'
//                         style={{ fontSize: '14px' }}
//                       >
//                         Check delivery availability
//                       </span>
//                     </div>

//                     <Form
//                       onSubmit={e => {
//                         e.preventDefault()
//                         checkPincode()
//                       }}
//                     >
//                       <div className='d-flex gap-2'>
//                         <Form.Control
//                           type='text'
//                           inputMode='numeric'
//                           placeholder='Enter 6-digit pincode'
//                           value={pincode}
//                           maxLength={6}
//                           onChange={e => {
//                             setPincode(
//                               e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
//                             )
//                             setPincodeMsg('')
//                             setPincodeAvailable(null)
//                           }}
//                           style={{
//                             borderRadius: '2px',
//                             border: '1px solid #D9D0C2',
//                             background: '#FFFEFB',
//                             boxShadow: 'none',
//                             maxWidth: '250px'
//                           }}
//                         />

//                         <Button
//                           type='submit'
//                           disabled={pincodeLoading}
//                           style={{
//                             background: '#29382F',
//                             border: 'none',
//                             borderRadius: '2px',
//                             minWidth: '90px'
//                           }}
//                         >
//                           {pincodeLoading ? 'Wait...' : 'Check'}
//                         </Button>
//                       </div>
//                     </Form>

//                     {pincodeMsg && (
//                       <div
//                         className='mt-2 small fw-semibold'
//                         style={{
//                           color: pincodeAvailable ? '#526B57' : '#B64B42'
//                         }}
//                       >
//                         {pincodeAvailable ? (
//                           <FaCheckCircle className='me-2' />
//                         ) : (
//                           <FaTimesCircle className='me-2' />
//                         )}
//                         {pincodeMsg}
//                       </div>
//                     )}
//                   </div>

//                   <div className='d-flex gap-2 flex-wrap'>
//                     <Button
//                       onClick={addToCart}
//                       className='flex-fill py-3 fw-semibold'
//                       style={{
//                         background: '#E9D9BC',
//                         color: '#29382F',
//                         border: '1px solid #D9C5A4',
//                         borderRadius: '2px',
//                         minWidth: '145px'
//                       }}
//                     >
//                       {/* <FaShoppingBag className='me-2' /> */}
//                       <i className='bi bi-cart me-2'></i>
//                       Add to Cart
//                     </Button>

//                     <Button
//                       onClick={buyNow}
//                       className='flex-fill py-3 fw-semibold'
//                       style={{
//                         background: '#29382F',
//                         color: '#FFFFFF',
//                         border: '1px solid #29382F',
//                         borderRadius: '2px',
//                         minWidth: '145px'
//                       }}
//                     >
//                       <FaBolt className='me-2' />
//                       Buy Now
//                     </Button>
//                   </div>

//                   {cartMessage && (
//                     <div
//                       className='mt-3 small fw-semibold'
//                       style={{
//                         color:
//                           cartMessage === 'Item already added to cart'
//                             ? '#B64B42'
//                             : '#526B57'
//                       }}
//                     >
//                       {cartMessage}
//                     </div>
//                   )}

//                   <div
//                     className='d-flex flex-wrap gap-4 mt-4'
//                     style={{ color: '#827D70', fontSize: '11px' }}
//                   >
//                     <span>
//                       <FaTruck className='me-2' />
//                       Delivery availability
//                     </span>
//                     <span>
//                       <FaShieldAlt className='me-2' />
//                       Secure checkout
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div>

//         {book.description && (
//           <section
//             className='mt-4 p-3 p-md-4'
//             style={{
//               background: '#FFFEFB',
//               border: '1px solid #E9E1D5'
//             }}
//           >
//             <h4
//               className='fw-bold mb-3'
//               style={{
//                 color: '#29382F',
//                 fontFamily: 'Georgia, serif'
//               }}
//             >
//               The Story Behind This Book
//             </h4>
//             <p
//               className='mb-0'
//               style={{
//                 color: '#77766E',
//                 lineHeight: '2',
//                 fontSize: '14px',
//                 whiteSpace: 'pre-line'
//               }}
//             >
//               {book.description}
//             </p>
//           </section>
//         )}

//         <section
//           className='mt-4 p-3 p-md-4'
//           style={{
//             background: '#FFFEFB',
//             border: '1px solid #E9E1D5'
//           }}
//         >
//           <h4
//             className='fw-bold mb-4'
//             style={{
//               color: '#29382F',
//               fontFamily: 'Georgia, serif'
//             }}
//           >
//             Product Highlights
//           </h4>

//           <Row className='g-0'>
//             {highlightItems.map(([label, value]) => (
//               <Col md={6} key={label}>
//                 <DetailRow label={label} value={value} />
//               </Col>
//             ))}
//           </Row>
//         </section>

//         <div
//           className='text-center py-5'
//           style={{
//             color: '#948879',
//             fontFamily: 'Georgia, serif',
//             letterSpacing: '1px',
//             fontSize: '13px'
//           }}
//         >
//           GOOD BOOKS. GOOD STORIES. GOOD MEMORIES.
//         </div>
//       </Container>
//     </div>
//   )
// }

// function DetailRow ({ label, value }) {
//   return (
//     <div
//       className='d-flex justify-content-between align-items-start gap-3 py-3 px-2'
//       style={{
//         borderBottom: '1px solid #E9E1D5',
//         fontSize: '13px'
//       }}
//     >
//       <span style={{ color: '#948879' }}>{label}</span>
//       <span
//         className='fw-semibold text-end'
//         style={{
//           color: '#29382F',
//           maxWidth: '60%',
//           overflowWrap: 'anywhere'
//         }}
//       >
//         {value ?? '-'}
//       </span>
//     </div>
//   )
// }

// export default BookDetail


import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, clearCartMessage } from './feactures/cart/cartSlice'
import axios from 'axios'
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

function BookDetail () {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()

  const [book, setBook] = useState({})
  const cartMessage = useSelector(state => state.cart.message)

  const [pincode, setPincode] = useState('')
  const [pincodeMsg, setPincodeMsg] = useState('')
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [pincodeAvailable, setPincodeAvailable] = useState(null)

  useEffect(() => {
    axios
      .get(`${apiUrl}/user/book/${id}`)
      .then(res => {
        setBook(res.data.data || {})
        dispatch(clearCartMessage())
      })
      .catch(err => console.log('Book fetch error:', err))
  }, [id, dispatch])

  const addToCart = () => {
    if (!book._id) return
    dispatch(addProduct(book))
  }

  const buyNow = () => {
    if (!book._id) return
    dispatch(addProduct(book))
    navigate('/checkout')
  }

  const checkPincode = async () => {
    setPincodeMsg('')
    setPincodeAvailable(null)

    const enteredPincode = pincode.trim()

    if (!/^[0-9]{6}$/.test(enteredPincode)) {
      setPincodeMsg('Please enter a valid 6-digit pincode')
      setPincodeAvailable(false)
      return
    }

    setPincodeLoading(true)

    try {
      const res = await axios.post(`${apiUrl}/check/book/pincode`, {
        book: id,
        pinCode: enteredPincode
      })

      const responseData = res.data

      const availability =
        responseData?.data?.isAvailable ??
        responseData?.isAvailable ??
        responseData?.data?.available

      setPincodeAvailable(availability === true)
      setPincodeMsg(
        responseData?.message ||
          (availability === true
            ? 'Delivery is available at this pincode'
            : 'Delivery not available at this pincode')
      )
    } catch (err) {
      setPincodeAvailable(false)
      setPincodeMsg(
        err.response?.data?.message || 'Delivery not available at this pincode'
      )
    } finally {
      setPincodeLoading(false)
      setPincode('')
    }
  }

  if (!book._id) {
    return (
      <Container className='py-5 text-center'>
        <div className='spinner-border text-primary' />
        <p className='mt-3 text-muted'>Loading book details...</p>
      </Container>
    )
  }

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      <Container className='py-4'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <Button
            variant='link'
            className='text-primary text-decoration-none fw-semibold p-0'
            onClick={() => navigate('/')}
          >
            <i className='bi bi-arrow-left me-2' />
            Back to Home
          </Button>

          <Badge bg='primary' className='px-3 py-2'>
            G.K.P BookStore
          </Badge>
        </div>

        <Card className='border-0 shadow-sm rounded-3'>
          <Card.Body className='p-3 p-md-4'>
            <Row className='g-4'>
              <Col lg={5} md={5}>
                <div
                  className='d-flex align-items-center justify-content-center rounded-3 p-3'
                  style={{
                    background: '#f8f9fa',
                    minHeight: '440px',
                    border: '1px solid #edf0f3'
                  }}
                >
                  {book.bookImage ? (
                    <img
                      src={book.bookImage}
                      alt={book.bookTittle}
                      className='img-fluid'
                      style={{
                        maxHeight: '400px',
                        width: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div className='text-muted'>No Image Available</div>
                  )}
                </div>

                <Row className='g-2 mt-2'>
                  <Col xs={6}>
                    <Button
                      variant='warning'
                      className='w-100 fw-semibold py-3'
                      onClick={addToCart}
                    >
                      <i className='bi bi-cart3 me-2' />
                      ADD TO CART
                    </Button>
                  </Col>

                  <Col xs={6}>
                    <Button
                      variant='success'
                      className='w-100 fw-semibold py-3'
                      onClick={buyNow}
                    >
                      <i className='bi bi-lightning-fill me-2' />
                      BUY NOW
                    </Button>
                  </Col>
                </Row>

                {cartMessage && (
                  <div
                    className={`text-center fw-semibold mt-3 ${
                      cartMessage === 'Item already added to cart'
                        ? 'text-danger'
                        : 'text-success'
                    }`}
                  >
                    {cartMessage}
                  </div>
                )}
              </Col>

              <Col lg={7} md={7}>
                <h3 className='fw-semibold mb-2' style={{ color: '#212121' }}>
                  {book.bookTittle || '-'}
                </h3>

                <p className='text-secondary mb-3'>
                  By{' '}
                  <span className='text-primary fw-semibold'>
                    {book.authorName || '-'}
                  </span>
                </p>

                {book.rating && (
                  <div className='mb-3'>
                    <Badge bg='success' className='me-2'>
                      {book.rating} <i className='bi bi-star-fill' />
                    </Badge>
                    <span className='text-muted small'>
                      {book.reviews || 0} Reviews
                    </span>
                  </div>
                )}

                <hr />

                <div className='mb-3'>
                  <div className='d-flex align-items-center gap-3 flex-wrap'>
                    <h2 className='fw-bold mb-0 text-dark'>
                      ₹{book.originalPrice ?? '-'}
                    </h2>
                    <Badge bg='success' className='px-3 py-2'>
                      Best Price
                    </Badge>
                  </div>
                  <p className='text-success fw-semibold mt-2 mb-0'>
                    <i className='bi bi-check-circle-fill me-2' />
                    Available for purchase
                  </p>
                </div>

                {book.shortDescription && (
                  <div className='mt-4'>
                    <h5 className='fw-semibold'>About this book</h5>
                    <p className='text-secondary' style={{ lineHeight: '1.7' }}>
                      {book.shortDescription}
                    </p>
                  </div>
                )}

                <div className='mt-4'>
                  <h5 className='fw-semibold mb-3'>Delivery Options</h5>

                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      checkPincode()
                    }}
                  >
                    <div className='d-flex gap-2 flex-wrap'>
                      <div style={{ maxWidth: '260px', flex: '1 1 180px' }}>
                        <Form.Control
                          type='text'
                          inputMode='numeric'
                          autoComplete='postal-code'
                          placeholder='Enter 6 digit pincode'
                          value={pincode}
                          maxLength={6}
                          onChange={e => {
                            const value = e.target.value
                              .replace(/[^0-9]/g, '')
                              .slice(0, 6)

                            setPincode(value)
                            setPincodeMsg('')
                            setPincodeAvailable(null)
                          }}
                        />
                      </div>

                      <Button
                        type='submit'
                        variant='outline-primary'
                        disabled={pincodeLoading}
                        className='fw-semibold'
                      >
                        {pincodeLoading ? 'Checking...' : 'Check'}
                      </Button>
                    </div>

                    {pincodeMsg && (
                      <p
                        className={`small fw-semibold mt-2 mb-0 ${
                          pincodeAvailable ? 'text-success' : 'text-danger'
                        }`}
                      >
                        <i
                          className={`bi ${
                            pincodeAvailable
                              ? 'bi-check-circle-fill'
                              : 'bi-exclamation-circle-fill'
                          } me-2`}
                        />
                        {pincodeMsg}
                      </p>
                    )}
                  </Form>

                  <div className='mt-4'>
                    <div className='d-flex align-items-center gap-3 mb-3'>
                      <i className='bi bi-truck fs-4 text-primary' />
                      <div>
                        <div className='fw-semibold'>Delivery Information</div>
                        <small className='text-muted'>
                          Check availability using your pincode
                        </small>
                      </div>
                    </div>

                    <div className='d-flex align-items-center gap-3 mb-3'>
                      <i className='bi bi-arrow-repeat fs-4 text-primary' />
                      <div>
                        <div className='fw-semibold'>Easy Shopping</div>
                        <small className='text-muted'>
                          Order your favourite books online
                        </small>
                      </div>
                    </div>

                    <div className='d-flex align-items-center gap-3'>
                      <i className='bi bi-shield-check fs-4 text-primary' />
                      <div>
                        <div className='fw-semibold'>Secure Checkout</div>
                        <small className='text-muted'>
                          Continue to checkout to place your order
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className='border-0 shadow-sm rounded-3 mt-4'>
          <Card.Body className='p-3 p-md-4'>
            <h4 className='fw-semibold mb-3'>Specifications</h4>

            <Row className='g-0'>
              <Col md={6}>
                <BookDetailLocal label='Author' value={book.authorName} />
                <BookDetailLocal label='Publisher' value={book.publisher} />
                <BookDetailLocal label='Imprint' value={book.imprint} />
                <BookDetailLocal
                  label='Publication Year'
                  value={book.publicationYear}
                />
                <BookDetailLocal label='ISBN' value={book.isbnNo} />
                <BookDetailLocal label='Edition' value={book.edition} />
              </Col>

              <Col md={6}>
                <BookDetailLocal label='Language' value={book.language} />
                <BookDetailLocal label='Genre' value={book.genre} />
                <BookDetailLocal label='Category' value={book.bookCategory} />
                <BookDetailLocal label='Rating' value={book.rating} />
                <BookDetailLocal label='Reviews' value={book.reviews} />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {book.description && (
          <Card className='border-0 shadow-sm rounded-3 mt-4'>
            <Card.Body className='p-3 p-md-4'>
              <h4 className='fw-semibold mb-3'>Product Description</h4>
              <p className='text-secondary mb-0' style={{ lineHeight: '1.8' }}>
                {book.description}
              </p>
            </Card.Body>
          </Card>
        )}

        <Card className='border-0 shadow-sm rounded-3 mt-4'>
          <Card.Body className='p-3 p-md-4'>
            <h4 className='fw-semibold mb-3'>Product Highlights</h4>

            <Row className='g-0'>
              <Col md={6}>
                <BookDetailLocal
                  label='Country of Origin'
                  value={book.countryOfOrigin}
                />
                <BookDetailLocal
                  label='Product From'
                  value={book.productFrom}
                />
                <BookDetailLocal
                  label='Manufacturer'
                  value={book.nameOfManufacturer}
                />
              </Col>

              <Col md={6}>
                <BookDetailLocal
                  label='Manufacturer Address'
                  value={book.addressOfManufacturer}
                />
                <BookDetailLocal label='Packager' value={book.nameOfPackager} />
                <BookDetailLocal
                  label='Packager Address'
                  value={book.addressOfPackager}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

function BookDetailLocal ({ label, value }) {
  return (
    <div className='d-flex border-bottom py-3 px-2'>
      <div className='text-secondary' style={{ width: '45%' }}>
        {label}
      </div>
      <div
        className='fw-semibold text-dark'
        style={{ width: '55%', overflowWrap: 'anywhere' }}
      >
        {value ?? '-'}
      </div>
    </div>
  )
}

export default BookDetail
