import { Container, Row, Col, } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5">

      {/* Main Footer */}
      <Container className="py-5">
        <Row>

          {/* Brand */}
          <Col md={4} className="mb-4">
            <h3 className="fw-bold">
              <i className="bi bi-book-half me-2"></i>
              G.K.P. BookStore
            </h3>

            <p className="text-secondary mt-3">
              Discover your next favorite book from our collection of
              fiction, education, technology, business and many more.
            </p>

            <div className="d-flex gap-4 mt-4">
              <a href="#" className="text-light fs-5">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="#" className="text-light fs-5">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="#" className="text-light fs-5">
                <i className="bi bi-twitter-x"></i>
              </a>

              <a href="#" className="text-light fs-5">
                <i className="bi bi-youtube"></i>
              </a>

              <a href="#" className="text-light fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2} sm={6} className="mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>

            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-secondary text-decoration-none">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/cart" className="text-secondary text-decoration-none">
                  Cart
                </a>
              </li>
              <li className="mb-2">
                <a href="/checkout" className="text-secondary text-decoration-none">
                  CheckOut
                </a>
              </li>
            </ul>
          </Col>

          {/* Categories */}
          <Col md={2} sm={6} className="mb-4">
            <h5 className="fw-bold mb-3">Categories</h5>

            <ul className="list-unstyled">
              <li className="mb-2 text-secondary">Fiction</li>
              <li className="mb-2 text-secondary">Technology</li>
              <li className="mb-2 text-secondary">Education</li>
              <li className="mb-2 text-secondary">Business</li>
              <li className="text-secondary">Self Development</li>
            </ul>
          </Col>

          {/* Customer Support */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Customer Support</h5>

            <p className="text-secondary mb-2">
              <i className="bi bi-geo-alt-fill me-2"></i>
              Ghaziabad, India
            </p>

            <p className="text-secondary mb-2">
              <i className="bi bi-telephone-fill me-2"></i>
              +91 8171xxxx32
            </p>

            <p className="text-secondary mb-2">
              <i className="bi bi-envelope-fill me-2"></i>
              gkp@bookstore.com
            </p>

            <p className="text-secondary">
              <i className="bi bi-clock-fill me-2"></i>
              Mon - Sun: 8:00 AM - 10:00 PM
            </p>
          </Col>

        </Row>
      </Container>

      {/* Bottom Footer */}
      <div className="border-top border-secondary">
        <Container>
          <Row className="py-3 align-items-center">

            <Col md={6}>
              <p className="mb-0 text-secondary">
                © 2026 G.K.P. BookStore. All Rights Reserved.
              </p>
            </Col>

            <Col md={6} className="text-md-end mt-2 mt-md-0">
              <a
                href="/privacy"
                className="text-secondary text-decoration-none me-3"
              >
                Privacy Policy
              </a>

              <a
                href="/terms"
                className="text-secondary text-decoration-none"
              >
                Terms & Conditions
              </a>
            </Col>

          </Row>
        </Container>
      </div>

    </footer>
  );
}

export default Footer;

