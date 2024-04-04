import React from 'react';
import SideMenu from '../components/SideMenu.jsx';
import { Link } from 'react-router-dom';
import MyFuntimes from '../components/MyFuntimes.jsx';
export default function MyFuntimesPage() {
    return (
        <div className="d-flex flex-column flex-md-row align-items-start justify-content-between h-100 ">      
        <div id='left-sidemenu' className="order-3 order-md-1 col-12 col-md-2 p-3 shadow-sm h-100 d-flex flex-column mt-5">        
        <nav  className="collapse d-lg-block sidebar collapse h-50 overflow-auto"> {/* Sidenav on top half */}
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
        The event page displays the event poster t the immersive world of VR art within.
         Below, a detailed description beckons you to embark on a mind-bending journey and meeting the visionary creators who push
          the boundaries of artistic expression. Entry fees and date information are clearly presented, while a dedicated comments section allows visitors to share their
           thoughts, experiences, and photos, creating a vibrant online community around the event..</p>
                  <div id='socials'className="d-flex mt-3">
                    <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
                    <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
                    <a href="https://github.com" className=""><i className="fab fa-github fa-lg"></i></a>
                  </div>
                </div>
              </div>
        
              {/* Middle section (50%) */}
              <div id='middle' className="order-1 order-md-2 col-md-8 mx-auto d-block p-3 shadow-sm"> 
                <MyFuntimes/>
            </div>

        
              {/* Right section (15%) */}
            
              <div className='sidebar-btn'>
                <SideMenu mode='myprofile'/>
              </div>
            </div>
          );
        };
        
        