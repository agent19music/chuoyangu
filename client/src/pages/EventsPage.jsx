import React, { useContext } from 'react';
import SideMenu from '../components/SideMenu.jsx';
import Event from '../components/Event.jsx';
import { EventContext } from '../context/EventContext';

const EventsPage = () => {
  const { setCategory } = useContext(EventContext);

  return (
    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between h-100">
      <div id='left-sidemenu' className="order-3 order-md-1 col-12 col-md-2 p-3 shadow-sm h-100 d-flex flex-column mt-5">
        <nav className="collapse d-lg-block sidebar collapse h-50 overflow-auto">
          <div className="position-sticky">
            <div id="sidebarMenu" className="list-group list-group-flush mx-3 mt-4">
              <button 
                onClick={() => setCategory('comingsoon')} 
                className="list-group-item list-group-item-action py-2 ripple text-dark button-style mb-2"
                aria-current="true"
              >
                <i className="far fa-clock fa-fw me-3"></i><span>Coming Soon</span>
              </button>
              <button 
                onClick={() => setCategory('past')} 
                className="list-group-item list-group-item-action py-2 ripple text-dark button-style mb-2"
              >
                <i className="far fa-calendar-xmark fa-fw me-3"></i><span>Past Events</span>
              </button>
              <button 
                onClick={() => setCategory('Educational')} 
                className="list-group-item list-group-item-action py-2 ripple text-dark button-style mb-2"
              >
                <i className="fas fa-book-open fa-fw me-3"></i><span>Educational Events</span>
              </button>
              <button 
                onClick={() => setCategory('Fun')} 
                className="list-group-item list-group-item-action py-2 ripple text-dark button-style mb-2"
              >
                <i className="far fa-face-smile-beam fa-fw me-3"></i><span>Fun Events</span>
              </button>
              <button 
                onClick={() => setCategory('Social')} 
                className="list-group-item list-group-item-action py-2 ripple text-dark button-style mb-2"
              >
                <i className="fas fa-user-group fa-fw me-3"></i><span>Social Events</span>
              </button>
            </div>
          </div>
        </nav>
        <div className="mt-auto d-flex flex-column align-items-center justify-content-center">
          <h4>About</h4>
          <p>
            The event page displays the event poster and details of the immersive world of VR art within.
            Below, a detailed description beckons you to embark on a mind-bending journey and meeting the visionary creators who push
            the boundaries of artistic expression. Entry fees and date information are clearly presented, while a dedicated comments section allows visitors to share their
            thoughts, experiences, and photos, creating a vibrant online community around the event.
          </p>
          <div id='socials' className="d-flex mt-3">
            <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
            <a href="https://github.com" className=""><i className="fab fa-github fa-lg"></i></a>
          </div>
        </div>
      </div>

      <div id='middle' className="order-1 order-md-2 col-12 col-md-8 mx-2 p-3 shadow-sm">
        <Event/>
      </div>

      <div id='right-sidemenu' className="order-2 order-md-3 col-12 col-md-2 mx-2 p-3 shadow-sm mt-3">
        <h4>Top Event</h4>
        <img src='https://blog.lyricallemonade.com/wp-content/uploads/2022/04/IMG_5074-scaled-1.jpg' alt='img' className='img-fluid'/>
        <h5>Description</h5>
        <p>
          In 2023, Bennett began releasing tracks from his debut studio album, titled All Is Yellow (2024). 
          The lead single from the album, &quot;Doomsday&quot;, featuring Juice Wrld and Cordae, was released on June 23, 2023, 
          and reached number 58 on the Billboard Hot 100, 49 on the Canadian Hot 100, 83 on the Irish Singles Chart, 
          and 92 on the UK Singles Chart. The album&apos;s second single, &quot;Guitar in My Room&quot;, featuring Lil Durk 
          and Kid Cudi, was released on September 29. The third single has yet to be announced.
        </p>
      </div>
      <div className='sidebar-btn'>
        <SideMenu mode='event'/>
      </div>
    </div>
  );
};

export default EventsPage;
