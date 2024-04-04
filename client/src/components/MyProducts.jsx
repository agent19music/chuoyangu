import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
// import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Comment from './Comment'; 

const MyProducts = () => {
  const { authToken, apiEndpoint } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [funtimes, setFuntimes] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${apiEndpoint}/my-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Data from fetch:', data);
        if (Array.isArray(data.my_products)) {
          setFuntimes(data.my_products);
        } else if (typeof data === 'object' && data.message) {
          setErrorMsg(data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [apiEndpoint, authToken]);

  // const handleLike = (funtimeId) => {
  //   // Implement like functionality
  // };

  // const handleSubmit = (e, funtimeId, localCommentText, setLocalCommentText) => {
  //   e.preventDefault();

  //   if (!localCommentText) {
  //     Swal.fire({
  //       icon: 'error',
  //       text: 'Please enter a comment!',
  //     });
  //     return;
  //   }
  //   if (localCommentText.length > 300) {
  //     Swal.fire({
  //       icon: 'error',
  //       text: 'Comment must be 300 characters or less!',
  //     });
  //     return;
  //   }

  //   if (localCommentText !== '') {
  //     // Implement comment submission
  //   }
  // };

  if (isLoading) return <h2 className="text-2xl text-center mt-12">Loading...</h2>;

  return (
    <div id="event-holder" className="bg-light overflow-auto">
      <h4>My Products</h4>
      <div className="mx-auto">
        {errorMsg ? (
          <p>{errorMsg}</p>
        ) : (
          funtimes.length > 0 ? (
            funtimes.map((product) => (
              <div className="card my-4" key={product.id}>
                <div className="row no-gutters">
                  <div className="col-md-4">
                    <h5>{product.title}</h5>
                    <img src={product.image_url} alt={product.title} className="img-fluid" />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{product.description}</h5>
                      <p className="card-text">Price: {product.price}</p>
                      <p className="card-text">Category: {product.category}</p>
                      <p className="card-text">Average Rating: {product.average_rating}</p>
                      <h6>Reviews:</h6>
                      <Comment comments={product.reviews} />
                      <div className="comment-input" style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#ffff', 
                        borderRadius: '25px', // Rounded Corners
                        padding: '10px' // Inner Spacing
                      }}>
                        
                     
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="p-5 alert alert-warning">
              <i className="fas fa-circle-info"></i> Oops! It seems there are no products here.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default MyProducts;
