import { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Table, Form, Button, Row, Col } from 'react-bootstrap'

const apiUrl = import.meta.env.VITE_API_URL

function TransactionList () {
  let [transactions, setTransactions] = useState([])
  useEffect(() => {
    axios({
      url: apiUrl + '/transactions',
      method: 'get'
    })
      .then(res => {
        setTransactions(res.data.data)
      })
      .catch(err => {
        alert(err)
      })
  }, [])
  return (
    <Container>
      <Row>
        <Col>
          <h3 className='mt-2 text-center text-danger'>Transactions List</h3>
          <Table className='mt-3'>
            <thead>
              <tr>
                <td>Transaction Id</td>
                <td>Email Id</td>
                <td>Products</td>
                <td>Amount</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>
                {
                    transactions.map((transaction) => 
                    <tr>
                        <td>{transaction.transactionId}</td>
                        <td>{transaction.email}</td>
                        <td>{transaction.products[0].bookTittle}</td>
                        <td>₹{transaction.amount}</td>
                        <td>{transaction.status}</td>
                    </tr>
                    )
                }
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}
export default TransactionList
