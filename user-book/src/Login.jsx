import { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL

function Login () {
  let [show, setShow] = useState(true)
  let [firstName, setFirstName] = useState('')
  let [lastName, setLastName] = useState('')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  function handleClose () {
    setShow(false)
  }
  function signUp () {
    let data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }
    axios({
      url: apiUrl + '/create/user',
      method: 'Post',
      data: data
    }).then((res) => {
        alert(res.data.message);
    }).catch(err => {
        alert(err)
    })
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type='text'
              onChange={e => setFirstName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type='text'
              onChange={e => setLastName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='text'
              onChange={e => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              onChange={e => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type='password'></Form.Control>
          </Form.Group>
          <Button variant='success' onClick={signUp}>
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default Login
