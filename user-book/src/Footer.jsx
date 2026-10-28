import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function Footer() {
  const linkStyle = {
    color: "#F0FDFA",
    textDecoration: "none",
    display: "inline-block",
    marginBottom: "10px"
  };

  return (
    <footer
      style={{
        backgroundColor: "#0F766E",
        color: "#F0FDFA",
        marginTop: "40px"
      }}
    >
      <Container className="py-5">
        <Row className="g-4">

          {/* Store Information */}
          <Col lg={4} md={6}>
            <h4 className="fw-bold mb-3 text-white">
              <i
                className="bi bi-book-half me-2"
                style={{ color: "#99F6E4" }}
              ></i>
              <span style={{ color: "#99F6E4" }}>G.K.P</span>
              {" "}BookStore
            </h4>

            <p style={{ lineHeight: "1.8" }}>
              Discover your next favorite book with us.
              Explore a world of knowledge, imagination
              and learning at G.K.P BookStore.
            </p>

            <div className="d-flex gap-3 mt-3">
              <a href="https://www.facebook.com/"
                aria-label="Facebook"
                style={linkStyle}>
                <i className="bi bi-facebook fs-5"></i>
              </a>

              <a href="https://www.instagram.com/"
                aria-label="Instagram"
                style={linkStyle}>
                <i className="bi bi-instagram fs-5"></i>
              </a>

              <a href="https://www.linkedin.com/"
                aria-label="LinkedIn"
                style={linkStyle}>
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h5 className="fw-bold text-white mb-3">
              Quick Links
            </h5>

            <div>
              <Link to="/" style={linkStyle}>
                <i className="bi bi-house me-2"></i>
                Home
              </Link>
            </div>

            <div>
              <Link to="/myorders" style={linkStyle}>
                <i className="bi bi-bag-check me-2"></i>
                My Orders
              </Link>
            </div>

            <div>
              <Link to="/cart" style={linkStyle}>
                <i className="bi bi-cart3 me-2"></i>
                My Cart
              </Link>
            </div>
          </Col>

          {/* Customer Support */}
          <Col lg={3} md={6}>
            <h5 className="fw-bold text-white mb-3">
              Customer Support
            </h5>

            <p className="mb-3">
              <i className="bi bi-headset me-2"></i>
              We're here to help
            </p>

            <Link to="/contact" style={linkStyle}>
              <i className="bi bi-envelope me-2"></i>
              Contact Us
            </Link>
          </Col>

          {/* Contact Information */}
          <Col lg={3} md={6}>
            <h5 className="fw-bold text-white mb-3">
              Get in Touch
            </h5>

            <p>
              <i className="bi bi-book me-2"></i>
              Books for every reader
            </p>

            <p>
              <i className="bi bi-truck me-2"></i>
              Convenient book delivery
            </p>

            <p>
              <i className="bi bi-shield-check me-2"></i>
              Secure online payments
            </p>
          </Col>

        </Row>

        <hr
          className="my-4"
          style={{
            borderColor: "#99F6E4",
            opacity: 0.6
          }}
        />

        <Row className="align-items-center text-center">
          <Col md={6}>
            <p className="mb-2 mb-md-0">
              © {new Date().getFullYear()} G.K.P BookStore.
              All rights reserved.
            </p>
          </Col>

          <Col md={6}>
            <span style={{ color: "#CCFBF1" }}>
              Made with <i className="bi bi-heart-fill text-danger"></i>
              {" "}for book lovers
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
