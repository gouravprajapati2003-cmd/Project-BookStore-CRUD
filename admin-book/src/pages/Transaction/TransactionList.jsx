// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { Container, Table, Form, Button, Row, Col } from 'react-bootstrap'

// const apiUrl = import.meta.env.VITE_API_URL

// function TransactionList () {
//   let [transactions, setTransactions] = useState([])
//   useEffect(() => {
//     axios({
//       url: apiUrl + '/transactions',
//       method: 'get'
//     })
//       .then(res => {
//         setTransactions(res.data.data)
//       })
//       .catch(err => {
//         alert(err)
//       })
//   }, [])
//   return (
//     <Container>
//       <Row>
//         <Col>
//           <h3 className='mt-2 text-center text-danger'>Transactions List</h3>
//           <Table className='mt-3' bordered>
//             <thead>
//               <tr>
//                 <td>Transaction Id</td>
//                 <td>Email Id</td>
//                 <td>Products</td>
//                 <td>Amount</td>
//                 <td>Status</td>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map(transaction => (
//                 <tr>
//                   <td>{transaction.transactionId}</td>
//                   <td>{transaction.email}</td>
//                   <td>{transaction.products[0].bookTittle}</td>
//                   <td>₹{transaction.amount}</td>
//                   <td
//                     className={
//                       transaction.status === 'Completed'
//                         ? 'text-success'
//                         : 'text-danger'
//                     }
//                   >
//                     {transaction.status}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Col>
//       </Row>
//     </Container>
//   )
// }
// export default TransactionList

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Table, Row, Col, Badge } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

function TransactionList () {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    axios({
      url: apiUrl + '/transactions',
      method: 'get'
    })
      .then(res => {
        console.log('Transactions API Response:', res.data)
        setTransactions(res.data.data || [])
      })
      .catch(err => {
        console.error('Error fetching transactions:', err)
        alert('Transactions load nahi ho sake.')
      })
  }, [])

  return (
    <Container fluid>
      <Row>
        <Col>
          <h3 className='mt-2 text-center text-danger'>Transactions List</h3>

          <Table className='mt-3' bordered responsive hover>
            <thead className='table-light'>
              <tr>
                <th>Transaction Id</th>
                <th>Email Id</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => {
                  const products = Array.isArray(transaction.products)
                    ? transaction.products
                    : []

                  return (
                    <tr
                      key={
                        transaction._id || transaction.transactionId || index
                      }
                    >
                      <td>{transaction.transactionId || 'N/A'}</td>

                      <td>{transaction.email || 'N/A'}</td>

                      <td>
                        {products.length > 0 ? (
                          products.map((product, productIndex) => (
                            <div key={product._id || productIndex}>
                              {product.bookTitle || 'Book title not found'}
                              {product.quantity > 1
                                ? ` (Qty: ${product.quantity})`
                                : ''}
                            </div>
                          ))
                        ) : (
                          <span className='text-muted'>No products found</span>
                        )}
                      </td>

                      <td>₹{transaction.amount ?? 0}</td>

                      <td>
                        <Badge
                          bg={
                            ['success', 'completed'].includes(
                              String(transaction.status || '').toLowerCase()
                            )
                              ? 'success'
                              : String(
                                  transaction.status || ''
                                ).toLowerCase() === 'failed'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {transaction.status || 'Pending'}
                        </Badge>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className='text-center'>
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

export default TransactionList
