import EducationalFuntime from '../components/EducationalFuntimes';
import SideMenu from '../components/SideMenu';
import { Link } from 'react-router-dom';
export default function EducationalFuntimesPage() {
  return (
    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between h-100 ">      {/* Left section (15%, with sidenav on top) */}
<div id='left-sidemenu' className="order-3 order-md-1 col-12 col-md-2 p-3 shadow-sm h-100 d-flex flex-column mt-5">        {/* Sidenav on top half */}
<nav  className="collapse d-lg-block sidebar collapse h-50 overflow-auto">
  <div className="position-sticky">
    <div id="sidebarMenu"className="list-group list-group-flush mx-3 mt-4">
      {/* Your sidenav links here */}
      <Link to="/funtimes/funny" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2" aria-current="true">
        <i className="far fa-face-laugh-beam fa-fw me-3"></i><span>Funny</span>
      </Link>
      <Link to="/funtimes/events" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
        <i className="fas fa-calendar-days fa-fw me-3"></i><span>Events</span>
      </Link>
      <Link to="funtimes/educational" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
        <i className="fas fa-book-open fa-fw me-3"></i><span>Educational</span>
      </Link>
    </div>
  </div>
</nav>


        {/* About section on bottom half */}
        <div className="mt-auto d-flex flex-column align-items-center justify-content-center">
          <h4>About</h4>
          <p>
The funtimes page displays students having fun as a basic description. Students are free to post SFW content on here about stuff stuff they like or are ectited about. Be it a quick selfie or a complex 
model shoot, share moments that you feel are true to you. Every week a top funtime will be displayed and it is always the most liked funtime of the week balh balh  nigga.
twhile a dedicated comments section allows visitors to share their
   thoughts online community around the event..</p>
          <div id='socials'className="d-flex mt-3">
            <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
            <a href="https://github.com" className=""><i className="fab fa-github fa-lg"></i></a>
          </div>
        </div>
      </div>

      {/* Middle section (50%) */}
      <div id='middle' className="order-1 order-md-2 col-12 col-md-8 mx-2 p-3 shadow-sm"> 
        <EducationalFuntime/>
      </div>

      {/* Right section (15%) */}
      <div id='right-sidemenu' className="order-2 order-md-3 col-12 col-md-2 mx-2 p-3 shadow-sm mt-3">        <h4>Top Funtime</h4>
        <img src='https://i.pinimg.com/564x/a6/c7/ce/a6c7cede43b629bab5f5532d4db35033.jpg' alt='event' className='img-fluid'/>
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
     <SideMenu mode='funtime'/>
    </div>
    </div>
  )
}
