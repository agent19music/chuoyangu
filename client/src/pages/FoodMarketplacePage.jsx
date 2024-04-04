import React from 'react';
import '../App.css'
import SideMenu from '../components/SideMenu';
import { Link } from 'react-router-dom';
import FoodProduct from '../components/FoodMarketplace';

const FoodMarketplace = () => {
  
  return (
    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between h-100 ">      
    <div id='left-sidemenu' className="order-3 order-md-1 col-12 col-md-2 p-3 shadow-sm h-100 d-flex flex-column mt-5">        
    <nav  className="collapse d-lg-block sidebar collapse h-50 overflow-auto"> {/* Sidenav on top half */}
      <div className="position-sticky">
        <div id="sidebarMenu"className="list-group list-group-flush mx-3 mt-4">
          {/* sidenav links here */}
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
        </div>
      </div>
    </nav>
    
    
            {/* About section on bottom half */}
            <div className="mt-auto d-flex flex-column align-items-center justify-content-center">
              <h4>About</h4>
              <p>
    The marketplace page displays products listed by student enterpreneurs. There is a review section in place where customers can leave their honest thoughts on the quality of 
    products they received. The merchant contact details are also displayed for fostering money making opportunities
     </p>
              <div id='socials'className="d-flex mt-3">
                <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
                <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
                <a href="https://github.com" className=""><i className="fab fa-github fa-lg"></i></a>
              </div>
            </div>
          </div>
      {/* Middle section (30%) */}
      <div id='middle' className="order-1 order-md-2 col-12 col-md-8 mx-2 p-3 shadow-sm"> 
        <FoodProduct/>
      </div>

      {/* Right section (45%) */}
      <>
      <div id='right-sidemenu' className="order-2 order-md-3 col-12 col-md-2 mx-2 p-3 shadow-sm mt-3">        <h4>Top Product</h4>
      <img src="https://news.kisspr.com/system/media_files/images/000/000/206/original/Miracle_Berry.jpg" alt="Food" style={{ width: '100%', height: 'auto' }} />
        <h5>Description</h5>
       <p> Buying our healthy and juicy smoothies offers a delicious and convenient way to consume essential nutrients while satisfying cravings. Additionally, the refreshing taste and perceived health benefits attract health-conscious consumers seeking a tasty alternative to sugary drinks or snacks, making them a popular choice to maintain a balanced lifestyle.</p>

      </div>
      </>
      <div className='sidebar-btn'>
        <SideMenu mode='marketplace'/>
      </div>
    </div>
  );
};

export default FoodMarketplace;
