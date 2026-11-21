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
    setUsername(localStorage.getItem('adminName') || 'Admin')
  }, [])

  const handleLogout = () => {
    // Remove only Admin login data
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminName')
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('adminUserType')
    localStorage.removeItem('adminIsSuperAdmin')
    localStorage.removeItem('adminLoginTime')

    navigate('/', { replace: true })
  }

  return (
    <>
      <style>
        {`
          .admin-navbar {
            background: #172554;
            box-shadow: 0 3px 12px rgba(0,0,0,0.07);
            min-height: 100px;
            position: sticky;
            top: 0;
            width: 100%;
            z-index: 1020;
          }

          .admin-brand {
            color: #ffffff !important;
            min-width: 0;
          }

          .admin-brand-title {
            font-size: 24px;
            white-space: nowrap;
          }

          .admin-brand-subtitle {
            font-size: 12px;
            color: #94a3b8;
            letter-spacing: 1px;
          }

          .admin-navbar .navbar-toggler {
            border: 1px solid #94a3b8;
            padding: 6px 10px;
          }

          .admin-navbar .navbar-toggler:focus {
            box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
          }

          .admin-nav-link {
            color: #bfdbfe !important;
            transition: color 0.2s ease;
          }

          .admin-nav-link:hover,
          .admin-nav-link.active {
            color: #ffffff !important;
          }

          .admin-profile-toggle {
            background: #f1f5f9 !important;
            border: 1px solid #dbe2ea !important;
            color: #172554 !important;
          }

          .admin-profile-menu {
            min-width: 210px;
          }

          @media (min-width: 768px) and (max-width: 991px) {
            .admin-navbar {
              min-height: 85px;
            }

            .admin-brand img {
              width: 45px !important;
              height: 45px !important;
            }

            .admin-brand-title {
              font-size: 21px;
            }

            .admin-brand-subtitle {
              font-size: 10px;
            }

            .admin-navbar-collapse {
              padding-top: 15px;
              border-top: 1px solid rgba(255,255,255,0.12);
              margin-top: 12px;
            }
          }

          @media (max-width: 767px) {
            .admin-navbar {
              min-height: 75px;
            }

            .admin-navbar .container-fluid {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }

            .admin-brand {
              gap: 8px !important;
            }

            .admin-brand img {
              width: 42px !important;
              height: 42px !important;
            }

            .admin-brand-title {
              font-size: 18px;
            }

            .admin-brand-subtitle {
              font-size: 9px;
              letter-spacing: 0.7px;
            }

            .admin-navbar-collapse {
              padding: 15px 5px 8px;
              margin-top: 12px;
              border-top: 1px solid rgba(255,255,255,0.15);
            }

            .admin-navbar-links {
              align-items: stretch !important;
              gap: 5px !important;
            }

            .admin-nav-link {
              padding: 10px 8px !important;
              border-radius: 7px;
            }

            .admin-nav-link:hover {
              background: rgba(255,255,255,0.08);
            }

            .admin-profile-dropdown {
              width: 100%;
              margin-top: 12px;
            }

            .admin-profile-toggle {
              width: 100%;
              justify-content: flex-start;
              border-radius: 10px !important;
            }

            .admin-profile-menu {
              width: 100%;
            }
          }
        `}
      </style>

      <Navbar expand='lg' className='admin-navbar py-2'>
        <Container fluid className='px-3 px-md-4'>
          <Navbar.Brand
            as={NavLink}
            to='/dashboard'
            end
            className='admin-brand d-flex align-items-center gap-2 me-2'
          >
            <Image
              src={logo}
              width='52'
              height='52'
              roundedCircle
              style={{
                objectFit: 'cover',
                border: '2px solid #dbeafe',
                flexShrink: 0
              }}
            />

            <div className='d-flex flex-column'>
              <span className='fw-bold admin-brand-title'>
                G.K.P. BookStore
              </span>

              <small className='admin-brand-subtitle'>ADMIN DASHBOARD</small>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls='admin-navbar' className='bg-light' />

          <Navbar.Collapse
            id='admin-navbar'
            className='justify-content-end admin-navbar-collapse'
          >
            <Nav className='align-items-lg-center gap-lg-4 me-lg-4 admin-navbar-links'>
              <Nav.Link
                as={NavLink}
                to='/dashboard'
                end
                className='d-flex align-items-center gap-2 fw-semibold admin-nav-link'
              >
                <FaHome size={19} />
                Home
              </Nav.Link>

              <Nav.Link
                href='#'
                className='d-flex align-items-center gap-2 fw-semibold admin-nav-link'
              >
                <FaEnvelope size={19} />
                Contact
              </Nav.Link>
            </Nav>

            <Dropdown align='end' className='admin-profile-dropdown'>
              <Dropdown.Toggle
                variant='light'
                className='d-flex align-items-center gap-2 rounded-pill px-3 py-2 admin-profile-toggle'
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

              <Dropdown.Menu className='admin-profile-menu border-0 shadow rounded-3 mt-2 p-2'>
                <Dropdown.Header className='text-primary fw-bold'>
                  Account Settings
                </Dropdown.Header>

                <Dropdown.Item onClick={() => navigate('#')} className='py-2'>
                  <FaUser className='me-2 text-secondary' />
                  My Profile
                </Dropdown.Item>

                <Dropdown.Item onClick={() => navigate('#')} className='py-2'>
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
    </>
  )
}

export default AdminNavbar
