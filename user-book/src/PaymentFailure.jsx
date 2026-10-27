import { Container, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function PaymentFailure () {
  return (
    <Container className='d-flex justify-content-center align-items-center min-vh-100'>
      <Card
        className='text-center border-0 shadow-lg rounded-4 p-4'
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <Card.Body>
          <div className='text-danger mb-3'>
            <i className='bi bi-x-circle-fill display-1'></i>
          </div>

          <h2 className='text-danger fw-bold mb-3'>Payment Failed!</h2>

          <p className='text-secondary fs-5 mb-4'>
            Sorry, your payment has been declined. Please try again.
          </p>

          <div className='alert alert-danger rounded-3'>
            <i className='bi bi-exclamation-triangle-fill me-2'></i>
            No successful payment was recorded.
          </div>

          <div className='d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4'>
            <Button
              variant='danger'
              className='rounded-pill px-4 fw-semibold'
              onClick={() => window.history.back()}
            >
              <i className='bi bi-arrow-clockwise me-2'></i>
              Try Again
            </Button>

            <Button
              as={Link}
              to='/'
              variant='outline-secondary'
              className='rounded-pill px-4 fw-semibold'
            >
              <i className='bi bi-house-door me-2'></i>
              Back to Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default PaymentFailure
