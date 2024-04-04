import React from 'react';
import SideMenu from '../components/SideMenu.jsx';
import '../App.css'; 
import MyProfile from '../components/MyProfile.jsx';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  return (
    <div className="App"> {/* Add the App class to apply styles from App.css */}
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between h-100 ">      
        <div id='left-sidemenu' className="order-3 order-md-1 col-12 col-md-2 p-3 shadow-sm h-100 d-flex flex-column mt-5">        
          <nav className="collapse d-lg-block sidebar collapse h-50 overflow-auto"> {/* Sidenav on top half */}
            <div className="position-sticky">
              <div id="sidebarMenu"className="list-group list-group-flush mx-3 mt-4">
                {/* sidenav links here */}
                <Link to="/myprofile" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2" aria-current="true">
                    <i className="fas fa-user fa-fw me-3"></i><span>My Profile</span>
                </Link>
                <Link to="/myprofile/myevents" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
                    <i className="far fa-calendar fa-fw me-3"></i><span>My Events</span>
                </Link>
                <Link to="/myprofile/myfuntimes" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
                    <i className="far fa-smile fa-fw me-3"></i><span>My Funtimes</span>
                </Link>
                <Link to="/myprofile/mywishlist" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
                    <i className="far fa-heart fa-fw me-3"></i><span>My Wishlist</span>
                </Link>
                <Link to="/myprofile/myproducts" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
                    <i className="fas fa-cube fa-fw me-3"></i><span>My Products</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* About section on bottom half */}
          <div className="mt-auto d-flex flex-column align-items-center justify-content-center">
            <h4>About</h4>
            <p>
              The profile page allows users to view and manage their profile information. They can update their profile picture, username, bio, and delete their profile if needed. On the right side, users can see their latest additions to the wishlist. On the left side, they can access their events, funtimes, and products.
            </p>
            <div id='socials'className="d-flex mt-3">
              <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="https://github.com" className=""><i className="fab fa-github fa-lg"></i></a>
            </div>
          </div>
        </div>

        {/* Middle section (50%) */}
        <div id='middle' className="order-1 order-md-2 col-12 col-md-8 mx-2 p-3 shadow-sm"> 
          {/* Profile Picture, ID, Username, Bio, Update, Delete Profile buttons */}
          <MyProfile/>
        </div>

        {/* Right section (15%) */}
        <div id='right-sidemenu' className="order-2 order-md-3 col-12 col-md-2 mx-2 p-3 shadow-sm mt-3">        
          <h4>Latest Additions to Wishlist</h4>
          <a href="#my-wishlist" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
  <span>My Wishlist</span>
</a>

          {/* Render the latest additions to wishlist */}
          
        </div>

        <div className='sidebar-btn'>
          <SideMenu mode='myprofile'/>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
