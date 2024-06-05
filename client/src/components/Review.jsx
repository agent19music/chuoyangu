import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';

const Review = ({ productid }) => {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(''); // Default rating
  const [reviews, setReviews] = useState([]);
  const { authToken, apiEndpoint } = useContext(UserContext);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newRating < 1 || newRating > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Rating should be from 1 to 5.',
      });
      return;
    }
    try {
      const response = await axios.post(
        `${apiEndpoint}/product/${productid}/review`,
        {
          text: newReview,
          rating: newRating,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken && authToken}`,
          },
        }
      );
      if (response.status === 201) {
        setIsWritingReview(false);
        setNewReview('');
        setNewRating(4); // Reset rating to default after submission

        const newReviewData = {
          text: newReview,
          rating: newRating,
          // Assuming the API response includes the newly added review details
          // Modify this according to the actual response structure
          ...response.data.review,
        };

        console.log('New review data:', newReviewData); // Log the new review data

        setReviews([...reviews, newReviewData]);
      }
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let url = `${apiEndpoint}/product/${productid}/reviews`;
        const response = await axios.get(url);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchReviews();
  }, [productid, apiEndpoint]);

  return (
    <div className="overflow-auto" style={{ maxHeight: '250px' }}>
      {isWritingReview && (
        <form onSubmit={handleReviewSubmit}>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            style={{ width: '100%', height: '100px', marginBottom: '10px' }}
          />
          <input
            type="number"
            min="0"
            max="5"
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
            placeholder="Rate"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button type="submit" className="btn btn-dark">
            Submit Review
          </button>
        </form>
      )}
      {!isWritingReview && (
        <button onClick={() => setIsWritingReview(true)} className="btn btn-dark">
          Add a Review
        </button>
      )}
      {reviews &&
        reviews.map(({ userImage, username, text, rating }) => (
          <div className="d-flex align-items-start flex-column my-2" key={username}>
            {userImage ? (
              <img src={`data:image/jpeg;base64,${userImage}`} alt="User" className="rounded-circle mr-2" style={{ width: '2rem', height: '2rem' }} />
            ) : (
              <i className="fas fa-user"></i>
            )}
            <small className="text-muted">{username}</small>
            <p className="mb-0 text-black" style={{ textAlign: 'center' }}>
              {text}
            </p>
            <div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>
              <span className="text-muted">
                <i className="fas fa-star"></i> Rating: {rating}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Review;
