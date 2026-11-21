import React, { useEffect, useState } from 'react'
import { Card, Container, Row, Col, Image, Badge } from 'react-bootstrap'

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
  const [time, setTime] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')

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

  useEffect(() => {
    const updateTime = () => {
      const currentTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })

      setTime(currentTime.replace(/\b(am|pm)\b/i, match => match.toUpperCase()))
    }

    updateTime()

    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>
        {`
          .dashboard-container {
            width: 100%;
            overflow-x: hidden;
          }

          .welcome-banner {
            background: linear-gradient(
              120deg,
              #172554,
              #2563eb,
              #0891b2
            );
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.15);
          }

          .quick-action-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .quick-action-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.09) !important;
          }

          .welcome-description {
            color: #dbeafe;
            max-width: 520px;
            line-height: 1.7;
          }

          .welcome-logo {
            width: 115px;
            height: 115px;
            object-fit: cover;
            border: 4px solid white;
          }

          .bottom-info {
            background: #f1f5f9;
          }

          @media (max-width: 767px) {
            .dashboard-container {
              padding: 18px 12px !important;
            }

            .dashboard-header {
              gap: 12px;
            }

            .dashboard-header h4 {
              font-size: 19px;
            }

            .welcome-banner .card-body {
              padding: 24px 18px !important;
            }

            .welcome-banner h2 {
              font-size: 23px;
            }

            .welcome-description {
              font-size: 14px;
            }

            .welcome-logo {
              width: 90px;
              height: 90px;
            }

            .welcome-date-time {
              gap: 10px !important;
              font-size: 13px;
              flex-direction: column;
              align-items: flex-start !important;
            }

            .quick-action-card .card-body {
              padding: 20px !important;
            }

            .bottom-info .card-body {
              padding: 16px !important;
            }

            .bottom-info-badge {
              margin-top: 14px;
            }
          }

          @media (min-width: 768px) and (max-width: 991px) {
            .welcome-banner h2 {
              font-size: 25px;
            }

            .welcome-logo {
              width: 100px;
              height: 100px;
            }
          }
        `}
      </style>

      <Container fluid className='dashboard-container px-3 px-md-4 py-4'>
        {/* Header */}
        <Row className='align-items-center mb-4 dashboard-header'>
          <Col xs={12} sm>
            <h4 className='fw-bold mb-1' style={{ color: '#1e293b' }}>
              Dashboard Overview
            </h4>

            <p className='text-secondary mb-0'>
              Welcome to your administration panel.
            </p>
          </Col>

          <Col xs={12} sm='auto'>
            <Badge
              bg='success'
              className='px-3 py-2 rounded-pill'
              style={{ fontSize: '12px' }}
            >
              <span className='me-2'>●</span>
              System Active
            </Badge>
          </Col>
        </Row>

        {/* Welcome Banner */}
        <Card className='border-0 rounded-4 overflow-hidden mb-4 welcome-banner'>
          <Card.Body className='p-4 p-md-5 text-white'>
            <Row className='align-items-center'>
              <Col xs={12} md={8}>
                <Badge
                  bg='light'
                  text='primary'
                  className='rounded-pill px-3 py-2 mb-3'
                >
                  <FaUserShield className='me-2' />
                  Administrator Panel
                </Badge>

                <h2 className='fw-bold mb-3'>Welcome Back, {username}!</h2>

                <p className='welcome-description mb-4'>
                  Manage your Books, Discounts, Users efficiently. Keep track of
                  Pincode Availability, Transactions, and other important
                  information from one place.
                </p>

                <div className='d-flex flex-wrap gap-3 align-items-center welcome-date-time'>
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

              <Col xs={12} md={4} className='text-center mt-4 mt-md-0'>
                <div
                  className='d-inline-flex justify-content-center align-items-center rounded-circle p-3'
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <Image src={logo} className='rounded-circle welcome-logo' />
                </div>

                <h6 className='fw-bold mt-3 mb-1'>{username}</h6>

                <small style={{ color: '#dbeafe' }}>System Administrator</small>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Quick Access Heading */}
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
            <Col xs={12} sm={6} lg={4} key={index}>
              <Card
                className='border-0 rounded-4 h-100 quick-action-card'
                onClick={() => navigate(item.path)}
                style={{
                  background: '#ffffff',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.05)'
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
        <Card className='border-0 rounded-4 mt-4 bottom-info'>
          <Card.Body className='p-3 px-4'>
            <Row className='align-items-center'>
              <Col xs={12} md>
                <div className='d-flex align-items-center'>
                  <FaChartLine
                    className='me-3 flex-shrink-0'
                    style={{
                      color: '#2563eb',
                      fontSize: '24px'
                    }}
                  />

                  <div>
                    <h6 className='fw-bold mb-1'>Everything in One Place</h6>

                    <small className='text-secondary'>
                      Your Book management system is ready to use.
                    </small>
                  </div>
                </div>
              </Col>

              <Col xs={12} md='auto' className='bottom-info-badge'>
                <Badge bg='primary' className='px-3 py-2 rounded-pill'>
                  Book Management System
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default WelcomePage
