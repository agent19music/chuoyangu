import  {useContext}from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import { UserContext } from '../context/UserContext';


const Navbar = () => {
  const {currentUser} = useContext(UserContext)
  return (
    <div>
      <div className='navbar-container bg-white shadow-sm'>
        <ul className="navbar-nav flex-row d-flex d-md" style={{ justifyContent: 'space-evenly', fontSize: '2em' }}>
          <li className="nav-item me-3 me-lg-1">
            <Link className="nav-link" to="/">
              <i className="fas fa-home"></i>
              <span className="badge rounded-pill badge-notification bg-danger"></span>
              <h6 className="nav-text">Home</h6>
            </Link>
          </li>

          <li className="nav-item me-3 me-lg-1">
            <Link className="nav-link" to="/events">
              <i className="fas fa-calendar-days"></i>
              <span className="badge rounded-pill badge-notification bg-danger"></span>
              <h6 className="nav-text">Events</h6>
            </Link>
          </li>

          <li className="nav-item me-3 me-lg-1">
            <Link className="nav-link" to="/studentpage"> {/* Connect to StudentsPage */}
              <i className="fas fa-users"></i>
              <h6 className="nav-text">StudentsPage</h6>
            </Link>
          </li>

          <li className="nav-item me-3 me-lg-1">
            <Link className="nav-link" to="/marketplace">
              <i className="fas fa-shopping-bag"></i>
              <h6 className="nav-text">Marketplace</h6>
            </Link>
          </li>

          <div className="nav-item me-3 me-lg-1">
            <div className="dropdown">
              <Link
                className="nav-link dropdown-toggle hidden-arrow"
                to="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <img src={currentUser.image_url|| '/default-pfp.jpg'} alt='p' className="rounded-circle mr-2" style={{ width: '3rem', height: '3rem' }}/>
              </Link>
              
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <Link className="dropdown-item" to="/myprofile">View Profile</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">Toggle dark mode</Link>
                </li>
                {/* <li>
                  <Link className="dropdown-item" to="/mywishlist">My Wishlist</Link>
                </li> */}
                <li>
                  <Link className="dropdown-item" to="/addproduct">Add Product</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/addevent">Add Event</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/addfuntime">Add Funtime</Link>
                </li>
              </ul>
            </div>
          </div>
        </ul>
      </div>
      
    </div>
  );
};

export default Navbar;
