import React, { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Dropdown, Image } from 'react-bootstrap'

import { NavLink, useNavigate } from 'react-router-dom'

import {
  FaUserCircle,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaEnvelope
} from 'react-icons/fa'

import logo from '../assets/logo.png'

function AdminNavbar () {
  const navigate = useNavigate()
  const [username, setUsername] = useState('Admin')

  useEffect(() => {
    setUsername(localStorage.getItem('name') || 'Admin')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    navigate('/')
  }

  return (
    <Navbar
      expand='lg'
      className='py-2'
      style={{
        background: '#172554',
        boxShadow: '0 3px 12px rgba(0,0,0,0.07)',
        minHeight: '100px',
        position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 1020
      }}
    >
      <Container fluid className='px-3 px-md-4'>
        {/* GKP Brand */}
        <Navbar.Brand
          as={NavLink}
          to='/admin/dashboard'
          className='d-flex align-items-center gap-2'
          style={{ color: '#ffffff' }}
        >
          <Image
            src={logo}
            width='52'
            height='52'
            roundedCircle
            style={{
              objectFit: 'cover',
              border: '2px solid #dbeafe'
            }}
          />

          <div className='d-flex flex-column'>
            <span className='fw-bold fs-4'>G.K.P. BookStore</span>

            <small
              style={{
                fontSize: '12px',
                color: '#64748b',
                letterSpacing: '1px'
              }}
            >
              ADMIN DASHBOARD
            </small>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls='admin-navbar' />

        <Navbar.Collapse id='admin-navbar' className='justify-content-end'>
          {/* Home and Contact */}
          <Nav className='align-items-lg-center gap-lg-4 me-lg-4'>
            <Nav.Link
              as={NavLink}
              to='/admin/dashboard'
              className='d-flex align-items-center gap-2 fw-semibold'
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : '#2563eb'
              })}
            >
              <FaHome size={19} />
              Home
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to='/contact'
              className='d-flex align-items-center gap-2 fw-semibold'
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : '#2563eb'
              })}
            >
              <FaEnvelope size={19} />
              Contact
            </Nav.Link>
          </Nav>

          {/* Admin Profile */}
          <Dropdown align='end' className='mt-3 mt-lg-0'>
            <Dropdown.Toggle
              variant='light'
              className='d-flex align-items-center gap-2 rounded-pill px-3 py-2'
              style={{
                background: '#f1f5f9',
                border: '1px solid #dbe2ea',
                color: '#172554'
              }}
            >
              <FaUserCircle size={30} />

              <div className='d-flex flex-column text-start'>
                <span className='fw-semibold' style={{ fontSize: '14px' }}>
                  {username}
                </span>

                <small style={{ fontSize: '11px', color: '#64748b' }}>
                  Administrator
                </small>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className='border-0 shadow rounded-3 mt-2 p-2'>
              <Dropdown.Header className='text-primary fw-bold'>
                Account Settings
              </Dropdown.Header>

              <Dropdown.Item
                onClick={() => navigate('/profile')}
                className='py-2'
              >
                <FaUser className='me-2 text-secondary' />
                My Profile
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => navigate('/settings')}
                className='py-2'
              >
                <FaCog className='me-2 text-secondary' />
                Settings
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item
                onClick={handleLogout}
                className='py-2 text-danger fw-semibold'
              >
                <FaSignOutAlt className='me-2' />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AdminNavbar
