import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

const SideMenu = ({ mode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const renderLinks = () => {
    if (mode === 'event') {
      return (
        <>
          <Link to="/events/comingsoon" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2" aria-current="true">
            <i className="far fa-clock fa-fw me-3"></i><span>Coming Soon</span>
          </Link>
          <Link to="/events/past" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="far fa-calendar-xmark fa-fw me-3"></i><span>Past Events</span>
          </Link>
          <Link to="/events/educational" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="fas fa-book-open fa-fw me-3"></i><span>Educational Events</span>
          </Link>
          <Link to="/events/fun" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="far fa-smile-beam fa-fw me-3"></i><span>Fun Events</span>
          </Link>
          <Link to="/events/social" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="fas fa-user-group fa-fw me-3"></i><span>Social Events</span>
          </Link>
        </>
      );
    } else if (mode === 'marketplace') {
      return (
        <>
          {/* Your marketplace links here */}
          <Link to="/marketplace/food" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2" aria-current="true">
          <i className="fas fa-pizza-slice fa-fw me-3"></i><span>Food</span>
          </Link>
          <Link to="/marketplace/tech" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
          <i className="fas fa-laptop-code fa-fw me-3"></i><span >Tech</span>
          </Link>
          <Link to="/marketplace/accessories" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
          <i className="fas fa-ring fa-fw me-3"></i><span>Accessories</span>
          </Link>
          <Link to="/marketplace/clothing" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="fas fa-shirt fa-fw me-3"></i><span>Clothing</span>
          </Link>
          <Link to="/marketplace/art" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="fas fa-palette fa-fw me-3"></i><span>Art</span>
          </Link>
        </>
      );
      
    } else if (mode === 'funtime') {
      return (
        <>
          <Link to="/funtimes/funny" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2" aria-current="true">
            <i className="far fa-laugh-beam fa-fw me-3"></i><span>Funny</span>
          </Link>
          <Link to="/funtimes/events" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="fas fa-calendar-days fa-fw me-3"></i><span>Events</span>
          </Link>
          <Link to="/funtimes/educational" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="fas fa-book-open fa-fw me-3"></i><span>Educational</span>
          </Link>
        </>
      );
    } else if (mode === 'myprofile') {
      return (
        <>
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
        </>
      );
    } else if (mode === 'students') {
      return (
        <>
          <Link to="/users/category/software_dev" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2" aria-current="true">
            <i className="far fa-laugh-beam fa-fw me-3"></i><span>SoftwareDev</span>
          </Link>
          <Link to="/users/category/cybersec" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="fas fa-calendar-days fa-fw me-3"></i><span>CyberSec</span>
          </Link>
          <Link to="/users/category/data_science" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="fas fa-book-open fa-fw me-3"></i><span>DataScience</span>
          </Link>
          <Link to="/users/category/ui_ux" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
            <i className="fas fa-fire fa-fw me-3"></i><span>UI_UX</span>
          </Link>
        </>
      );
    }
  };

  const renderAbout = () => {
    if (mode === 'event') {
      return (
        <div className="mt-auto d-flex flex-column align-items-center justify-content-center">
          <h4>About</h4>
          <p>
            The event page displays the event poster to the immersive world of VR art within. Below, a detailed description beckons you to embark on a mind-bending journey and meeting the visionary creators who push the boundaries of artistic expression. Entry fees and date information are clearly presented, while a dedicated comments section allows visitors to share their thoughts, experiences, and photos, creating a vibrant online community around the event.
          </p>
          <div id='socials' className="d-flex mt-3">
            <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
            <a href="https://github.com"><i className="fab fa-github fa-lg"></i></a>
          </div>
        </div>
      );
    } else if (mode === 'marketplace') {
      return (
        <div className="mt-auto d-flex flex-column align-items-center justify-content-center">
          <h4>About</h4>
          <p>
            The marketplace page displays products listed by student entrepreneurs. There is a review section in place where customers can leave their honest thoughts on the quality of products they received. The merchant contact details are also displayed for fostering money-making opportunities.
          </p>
          <div id='socials' className="d-flex mt-3">
            <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
            <a href="https://github.com"><i className="fab fa-github fa-lg"></i></a>
          </div>
        </div>
      );
    } else if (mode === 'funtime') {
      return (
        <div className="mt-auto d-flex flex-column align-items-center justify-content-center">
          <h4>About</h4>
          <p>
            The funtimes page displays students having fun as a basic description. Students are free to post SFW content on here about stuff they like or are excited about. Be it a quick selfie or a complex model shoot, share moments that you feel are true to you. Every week a top funtime will be displayed and it is always the most liked funtime of the week blah blah blah.
          </p>
          <div id='socials' className="d-flex mt-3">
            <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
            <a href="https://github.com"><i className="fab fa-github fa-lg"></i></a>
          </div>
        </div>
      );
    } else if (mode === 'myprofile') {
      return (
        <div className="mt-auto d-flex flex-column align-items-center justify-content-center">
          <h4>About</h4>
          <p>
            The profile page allows users to view and manage their profile information. They can update their profile picture, username, bio, and delete their profile if needed. On the right side, users can see their latest additions to the wishlist. On the left side, they can access their events, funtimes, and products.
          </p>
          <div id='socials' className="d-flex mt-3">
            <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
            <a href="https://github.com"><i className="fab fa-github fa-lg"></i></a>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <button className="btn btn-dark lg" onClick={toggleMenu}>
        <i className='fas fa-bars'></i>
      </button>
      <Menu
        right
        width={'240px'}
        disableAutoFocus
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        styles={{
          overlay: { background: 'rgba(0, 0, 0, 0.3)' },
          bmMenu: { background: 'white' }
        }}
      >
        {renderLinks()}
        {renderAbout()}
      </Menu>
    </div>
  );
};

export default SideMenu;
