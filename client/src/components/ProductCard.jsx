import React from 'react';
import Review from './Review';
import { Link } from 'react-router-dom';

const ProductCard = ({ title, description, average_rating, image_url, id, contact_info, price, handleDeleteProduct }) => {
  // console.log ("hi")

  return (
    <div className="card my-4">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img src={image_url} alt="" className="img-fluid" />
        </div>
        <div className="col-md-4 mx-auto">
          <div className="card-body">
            <h1 className="h3 font-weight-bold">{title}</h1>
            <p>{description}</p>
            <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="text-muted">
                <i className="fas fa-phone"></i> : {contact_info}
              </span>
              <span id = "money-bill">
                <i className="fas fa-money-bill"></i> : {price}
              </span>
              </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted">
                <i className="fas fa-star"></i> Rating: {average_rating}
                {/* Add more details as needed */}
              </span>
              <span className="text-muted">
                <button className="btn btn-link" onClick={() => alert('Added to wishlist')}>
                  <i className='far fa-bookmark'></i> Add to wishlist
                </button>
              </span>
            </div>
            <div className="px-4 py-2">
              <h3>REVIEWS:</h3>
              <Review  productid={id} />
            </div>
          </div>
        </div>
      </div>
      <div className='extra content '>
      <Link to={`/updateproduct/${id}`}>
        <button className="ui icon blue button">
          <i className="edit icon"></i> {/* Button for editing */}
        </button>
      </Link>
      <button className="ui icon red button" onClick={() => handleDeleteProduct(id)}>
        <i className="trash icon"></i> {/* Button for deleting product */}
      </button>
      </div>
    </div>
  );
};


export default ProductCard;
