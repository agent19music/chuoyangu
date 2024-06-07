import React, { useContext } from 'react';
import '../App.css';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { Link } from 'react-router-dom';
import Review from './Review';

const Product = () => {
  const { isLoading, products } = useContext(MarketplaceContext);

  if (isLoading) return <h2 className="text-2xl text-center mt-12">Loading...</h2>;

  return (
    <div id='event-holder' className="bg-light overflow-auto">
      <h4>MARKETPLACE</h4>
      <div className="mx-auto">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ title, description, average_rating, image_url, id, contact_info, price, handleDeleteProduct }) => {
  return (
    <div className="card my-4">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img src={`data:image/jpeg;base64,${image_url}`} alt="" className="img-fluid" />
        </div>
        <div className="col-md-4 mx-auto">
          <div className="card-body">
            <h1 className="h3 font-weight-bold">{title}</h1>
            <p>{description}</p>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted">
                <i className="fas fa-phone"></i> : {contact_info}
              </span>
              <span id="money-bill">
                <i className="fas fa-money-bill"></i> : {price}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted">
                <i className="fas fa-star"></i> Rating: {average_rating}
              </span>
              <span className="text-muted">
                <button className="btn btn-link" onClick={() => alert('Added to wishlist')}>
                  <i className='far fa-bookmark'></i> Add to wishlist
                </button>
              </span>
            </div>
            <div className="px-4 py-2">
              <h3>REVIEWS:</h3>
              <Review productid={id} />
            </div>
          </div>
        </div>
      </div>
      <div className='extra content'>
        <Link to={`/updateproduct/${id}`}>
          <button className="ui icon blue button">
            <i className="edit icon"></i>
          </button>
        </Link>
        <button className="ui icon red button" onClick={() => handleDeleteProduct(id)}>
          <i className="trash icon"></i>
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  average_rating: PropTypes.number.isRequired,
  image_url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  contact_info: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  handleDeleteProduct: PropTypes.func.isRequired
};

export default Product;
