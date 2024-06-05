import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import Comment from './Comment';
import { FuntimeContext } from '../context/FuntimeContext';
import PropTypes from 'prop-types';

export default function Funtime() {
  const { authToken, currentUser, apiEndpoint } = useContext(UserContext);
  const { funtimes, setOnchange, setFuntimes, isLoading } = useContext(FuntimeContext);

  const handleLike = async (funtimeId) => {
    try {
      const response = await fetch(`${apiEndpoint}/toggle-like-fun_time/${funtimeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken && authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      console.log(data);

      setFuntimes((prevFuntimes) => {
        return prevFuntimes.map((funTime) => {
          if (funTime.funtimeId === funtimeId) {
            return {
              ...funTime,
              total_likes: data.like_count,
              liked: !funTime.liked,
            };
          }
          return funTime;
        });
      });
    } catch (error) {
      console.error('Error toggling like:', error.message);
      Swal.fire({
        icon: 'error',
        text: 'A network error occurred: ' + error.message,
      });
    }
  };

  useEffect(() => {
    console.log('liked');
  }, [funtimes]);

  function handleSubmit(e, funtimeId, localCommentText) {
    e.preventDefault();

    if (!localCommentText) {
      Swal.fire({
        icon: 'error',
        text: 'Please enter a comment!',
      });
      return;
    }
    if (localCommentText.length > 300) {
      Swal.fire({
        icon: 'error',
        text: 'Comment must be 300 characters or less!',
      });
      return;
    }

    if (localCommentText !== '') {
      sendComment(localCommentText, funtimeId);
    }
  }

  function sendComment(localCommentText, funtimeId) {
    fetch(`${apiEndpoint}/comment-fun_time/${funtimeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken && authToken}`,
      },
      body: JSON.stringify({ text: localCommentText, fun_time_id: funtimeId }),
    }).then((res) => {
      if (res.ok) {
        setOnchange((prev) => !prev);
      }
    });
  }

  if (isLoading) return <h2 className="text-2xl text-center mt-12">Loading...</h2>;

  return (
    <div id='event-holder' className="bg-light overflow-auto">
      <h4>FUNTIMES</h4>
      <div className="mx-auto">
        {funtimes && funtimes.map((funtime, index) => (
          <FuntimeCard
            key={index}
            index={index}
            {...funtime}
            funtimeId={funtime.funtimeId}
            userId={currentUser.id}
            handleLike={handleLike}
            handleSubmit={handleSubmit}
            user_image={funtime.user.image}
            username={funtime.user.username}
          />
        ))}
      </div>
    </div>
  );
}


const FuntimeCard = ({
  index,
  image_url,
  description,
  total_likes,
  category,
  username,
  user_image,
  comments,
  handleLike,
  handleSubmit,
  funtimeId,
}) => {
  const [localCommentText, setLocalCommentText] = useState('');

  return (
    <div className="card my-4">
      <div className="row no-gutters">
        <div className="col-md-4">
          <div className="d-flex align-items-center">
          {user_image ? (
              <img src={`data:image/jpeg;base64,${user_image}`} alt="" className="rounded-circle m-3" style={{ width: '3rem', height: '3rem' }} />
            ) : (
              <i className="fas fa-user-circle fa-3x"></i>
            )}
            <span>{username}</span>
          </div>
          
          <img src={`data:image/jpeg;base64,${image_url}`} alt="" className="img-fluid" />
        </div>
        <div className="col-md-4 mx-auto">
          <div className="card-body">
            <h5 className="h3 font-weight-bold">{description}</h5>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted">
                <i className="far fa-heart" onClick={() => handleLike(funtimeId)} style={{ cursor: 'pointer' }}></i> Likes: {total_likes}
              </span>
              <span className="text-muted">
                <i className="fas fa-list"></i> Category: {category}
              </span>
            </div>
            <div className="px-4 py-2">
              <h3>COMMENTS:</h3>
              <Comment comments={comments} />
              <div
                className="comment-input"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffff',
                  borderRadius: '25px',
                  padding: '10px',
                }}
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="form-control mt-2"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'black',
                    color: 'black',
                    fontSize: 'large',
                  }}
                  value={localCommentText}
                  onChange={(e) => setLocalCommentText(e.target.value)}
                />
                <button
                  className="submit-button"
                  onClick={(e) => {
                    handleSubmit(e, funtimeId, localCommentText);
                    setLocalCommentText('');
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                  }}
                >
                  <i className="fas fa-arrow-up"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FuntimeCard.propTypes = {
  index: PropTypes.number.isRequired,
  image_url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  total_likes: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  user_image: PropTypes.string,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string,
      user_id: PropTypes.number,
      fun_time_id: PropTypes.number,
    })
  ).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  funtimeId: PropTypes.number.isRequired,
};

Funtime.propTypes = {
  authToken: PropTypes.string,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  funtimes: PropTypes.arrayOf(
    PropTypes.shape({
      funtimeId: PropTypes.number,
      image_url: PropTypes.string,
      description: PropTypes.string,
      total_likes: PropTypes.number,
      category: PropTypes.string,
      username: PropTypes.string,
      user_image: PropTypes.string,
      liked: PropTypes.bool,
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          text: PropTypes.string,
          user_id: PropTypes.number,
          fun_time_id: PropTypes.number,
        })
      ),
    })
  ).isRequired,
  setOnchange: PropTypes.func.isRequired,
  setFuntimes: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

Comment.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string,
      user_id: PropTypes.number,
      fun_time_id: PropTypes.number,
    })
  ).isRequired,
};
