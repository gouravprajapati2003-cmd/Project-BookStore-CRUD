import React, { useEffect, useState } from 'react'
import {
  Card,
  Container,
  Row,
  Col,
  Image,
  Button,
  Badge
} from 'react-bootstrap'
import {
  FaUserShield,
  FaBook,
  FaTag,
  FaExchangeAlt,
  FaArrowRight,
  FaChartLine,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa'

import 'bootstrap/dist/css/bootstrap.min.css'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'

function WelcomePage () {
  const [username, setUserName] = useState('Admin')
  let navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      setUserName(localStorage.getItem('name') || 'Admin')
    }
  }, [])

  const quickActions = [
    {
      title: 'Manage Books',
      description: 'View and manage all available Books.',
      icon: <FaBook />,
      color: '#6366f1',
      bg: '#eef2ff',
      path: '/books'
    },
    {
      title: 'Manage Discounts',
      description: 'Organize Books and Discounts departments.',
      icon: <FaTag />,
      color: '#0891b2',
      bg: '#ecfeff',
      path: '/discounts'
    },
    {
      title: 'Manage Transactions',
      description: 'Maintain Transactions details and information.',
      icon: <FaExchangeAlt />,
      color: '#059669',
      bg: '#ecfdf5',
      path: '/transactions'
    }
  ]

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const time = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  return (
    <Container fluid className='px-3 px-md-4 py-4'>
      {/* Header */}
      <Row className='align-items-center mb-4'>
        <Col>
          <h4 className='fw-bold mb-1' style={{ color: '#1e293b' }}>
            Dashboard Overview
          </h4>
          <p className='text-secondary mb-0'>
            Welcome to your administration panel.
          </p>
        </Col>

        <Col xs='auto'>
          <Badge
            bg='success'
            className='px-3 py-2 rounded-pill'
            style={{ fontSize: '12px' }}
          >
            <span className='me-2'>●</span> System Active
          </Badge>
        </Col>
      </Row>

      {/* Welcome Banner */}
      <Card
        className='border-0 rounded-4 overflow-hidden mb-4'
        style={{
          background: 'linear-gradient(120deg, #172554, #2563eb, #0891b2)',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.15)'
        }}
      >
        <Card.Body className='p-4 p-md-5 text-white'>
          <Row className='align-items-center'>
            <Col md={8}>
              <Badge
                bg='light'
                text='primary'
                className='rounded-pill px-3 py-2 mb-3'
              >
                <FaUserShield className='me-2' />
                Administrator Panel
              </Badge>

              <h2 className='fw-bold mb-3'>Welcome Back, {username}!</h2>

              <p
                className='mb-4'
                style={{
                  color: '#dbeafe',
                  maxWidth: '520px',
                  lineHeight: '1.7'
                }}
              >
                Manage your Books, Discounts, Users efficiently. Keep track of
                Pincode Availability, Transactions, and other important
                information from one place.
              </p>

              <div className='d-flex flex-wrap gap-3 align-items-center'>
                <div className='d-flex align-items-center'>
                  <FaCalendarAlt className='me-2' />
                  <span>{today}</span>
                </div>

                <div className='d-flex align-items-center'>
                  <FaClock className='me-2' />
                  <span>{time}</span>
                </div>
              </div>
            </Col>

            <Col md={4} className='text-center mt-4 mt-md-0'>
              <div
                className='d-inline-flex justify-content-center align-items-center rounded-circle p-3'
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <Image
                  src={logo}
                  width={115}
                  height={115}
                  roundedCircle
                  style={{
                    objectFit: 'cover',
                    border: '4px solid white'
                  }}
                />
              </div>

              <h6 className='fw-bold mt-3 mb-1'>{username}</h6>
              <small style={{ color: '#dbeafe' }}>System Administrator</small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Section Heading */}
      <div className='mb-3'>
        <h5 className='fw-bold mb-1' style={{ color: '#1e293b' }}>
          Quick Access
        </h5>
        <p className='text-secondary small mb-0'>
          Access your frequently used modules.
        </p>
      </div>

      {/* Quick Action Cards */}
      <Row className='g-3'>
        {quickActions.map((item, index) => (
          <Col lg={4} md={6} key={index}>
            <Card
              className='border-0 rounded-4 h-100'
              onClick={() => navigate(item.path)}
              style={{
                background: '#ffffff',
                boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.09)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.05)'
              }}
            >
              <Card.Body className='p-4'>
                <div
                  className='d-flex justify-content-center align-items-center rounded-3 mb-3'
                  style={{
                    width: '55px',
                    height: '55px',
                    background: item.bg,
                    color: item.color,
                    fontSize: '25px'
                  }}
                >
                  {item.icon}
                </div>

                <h6 className='fw-bold mb-2' style={{ color: '#1e293b' }}>
                  {item.title}
                </h6>

                <p
                  className='text-secondary small mb-3'
                  style={{ lineHeight: '1.6' }}
                >
                  {item.description}
                </p>

                <div
                  className='d-flex align-items-center fw-semibold small'
                  style={{ color: item.color }}
                >
                  Explore Module
                  <FaArrowRight className='ms-2' />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bottom Information */}
      <Card
        className='border-0 rounded-4 mt-4'
        style={{ background: '#f1f5f9' }}
      >
        <Card.Body className='p-3 px-4'>
          <Row className='align-items-center'>
            <Col>
              <div className='d-flex align-items-center'>
                <FaChartLine
                  className='me-3'
                  style={{ color: '#2563eb', fontSize: '24px' }}
                />

                <div>
                  <h6 className='fw-bold mb-1'>Everything in One Place</h6>
                  <small className='text-secondary'>
                    Your Book management system is ready to use.
                  </small>
                </div>
              </div>
            </Col>

            <Col xs='auto' className='mt-3 mt-md-0'>
              <Badge bg='primary' className='px-3 py-2 rounded-pill'>
                Book Management System
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default WelcomePage
