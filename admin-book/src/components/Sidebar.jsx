import { NavLink } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function Sidebar () {
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true'

  const menuItems = [
    { title: 'Manage Book', path: '/books', icon: 'bi-book' },
    { title: 'Manage User', path: '/users', icon: 'bi-people' },
    { title: 'Manage Discount', path: '/discounts', icon: 'bi-percent' },
    { title: 'Manage Availability', path: '/pincodes', icon: 'bi-geo-alt' },
    {
      title: 'Manage Transaction',
      path: '/transactions',
      icon: 'bi-arrow-left-right'
    },
    {
      title: 'Manage Reviews',
      path: '/reviews',
      icon: 'bi-star-half'
    },
    ...(isSuperAdmin
      ? [{ title: 'Manage Admins', path: '/admins', icon: 'bi-shield-lock' }]
      : [])
  ]

  return (
    <>
      <style>{`
        .admin-sidebar {
          width: 260px;
          min-width: 260px;
          flex: 0 0 260px;
          height: 100%;
          min-height: 0;
          position: relative;
          top: 0;
          background: #172554;
          box-shadow: 3px 0 15px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .sidebar-menu {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
        }

        .sidebar-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .sidebar-link {
          display: flex !important;
          align-items: center;
          gap: 12px;
          border: 0 !important;
          border-radius: 10px !important;
          padding: 13px 12px !important;
          color: #cbd5e1;
          background: transparent;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .sidebar-link:hover {
          background: rgba(255,255,255,0.09);
          color: #ffffff;
        }

        .sidebar-link.active {
          background: #2563eb !important;
          color: #ffffff !important;
          font-weight: 600;
        }

        .sidebar-link i {
          font-size: 19px;
          flex-shrink: 0;
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 991px) {
          .admin-sidebar {
            width: 220px;
            min-width: 220px;
            flex: 0 0 220px;
          }

          .sidebar-menu {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }

          .sidebar-link {
            gap: 9px;
            padding: 12px 10px !important;
            font-size: 13px;
          }

          .sidebar-link i {
            font-size: 17px;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .admin-sidebar {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            flex: 0 0 auto;
            height: auto;
            min-height: 0;
            position: relative;
            top: auto;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            box-shadow: 0 3px 12px rgba(0,0,0,0.08);
          }

          .sidebar-heading {
            padding: 10px 14px 5px !important;
          }

          .sidebar-menu {
            width: 100%;
            flex: none !important;
            min-height: auto;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 5px 10px 12px !important;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .sidebar-menu::-webkit-scrollbar {
            display: none;
          }

          .sidebar-list {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 8px !important;
            width: max-content;
            min-width: max-content;
          }

          .sidebar-link {
            width: auto;
            flex: 0 0 auto;
            padding: 10px 13px !important;
            gap: 8px;
            font-size: 13px;
            border-radius: 8px !important;
          }

          .sidebar-link i {
            font-size: 16px;
          }
        }
      `}</style>

      <div className='admin-sidebar'>
        <div className='px-4 pt-4 pb-3 sidebar-heading'>
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

        <div className='flex-grow-1 sidebar-menu px-3'>
          <ListGroup variant='flush' className='sidebar-list'>
            {menuItems.map(item => (
              <ListGroup.Item
                key={item.path}
                as={NavLink}
                to={item.path}
                end
                className='sidebar-link'
              >
                <i className={`bi ${item.icon}`} />
                <span>{item.title}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </>
  )
}

export default Sidebar
