import { NavLink } from 'react-router-dom'
import { ListGroup, Image } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
function Sidebar () {
  const menuItems = [
    {
      title: 'Manage Book',
      path: '/books',
      icon: 'bi-book'
    },
    {
      title: 'Manage User',
      path: '/users',
      icon: 'bi-people'
    },
    {
      title: 'Manage Discount',
      path: '/discounts',
      icon: 'bi-percent'
    },
    {
      title: 'Manage Availability',
      path: '/pincodes',
      icon: 'bi-geo-alt'
    },
    {
      title: 'Manage Transaction',
      path: '/transactions',
      icon: 'bi-arrow-left-right'
    }
  ]

  return (
    <div
  className="d-flex flex-column"
  style={{
    width: '260px',
    minWidth: '260px',
    height: 'calc(100vh - 100px)',
    position: 'sticky',
    top: '100px',
    background: '#172554',
    boxShadow: '3px 0 15px rgba(0,0,0,0.08)'
  }}
>
      {/* Navigation Heading */}
      <div className='px-4 pt-4 pb-3'>
        <small
          className='fw-semibold'
          style={{
            color: '#94a3b8',
            letterSpacing: '1.2px',
            fontSize: '11px'
          }}
        >
          MAIN MENU
        </small>
      </div>

      {/* Sidebar Modules */}
      <div
        className='flex-grow-1 overflow-auto px-3'
        style={{ scrollbarWidth: 'thin' }}
      >
        <ListGroup variant='flush' className='gap-2'>
          {menuItems.map((item, index) => (
            <ListGroup.Item
              key={index}
              as={NavLink}
              to={item.path}
              className='d-flex align-items-center gap-3 border-0 rounded-3 py-3 px-3'
              style={({ isActive }) => ({
                background: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#ffffff' : '#cbd5e1',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              })}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize: '19px' }} />

              <span style={{ fontSize: '14px' }}>{item.title}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  )
}

export default Sidebar
