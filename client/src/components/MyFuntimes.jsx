import { useState, useEffect, useContext } from 'react';
import '../App.css';
import Comment from './Comment';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export default function MyFuntimes() {
  const { authToken, apiEndpoint } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [onchange, setOnchange] = useState(false);
  const [funtimes, setFuntimes] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${apiEndpoint}/user-fun_times`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Data from fetch:', data);
        if (Array.isArray(data.user_fun_times)) {
          setFuntimes(data.user_fun_times);
        } else if (typeof data === 'object' && data.message) {
          setErrorMsg(data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [apiEndpoint, onchange, authToken]);

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
    fetch(`${apiEndpoint}/comment-event/${funtimeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken && authToken}`,
      },
      body: JSON.stringify({ text: localCommentText, funtime_id: funtimeId }),
    }).then((res) => {
      if (res.ok) {
        setOnchange((prev) => !prev);
      }
    });
  }

  async function deleteFuntime(funtimeId) {
    try {
      const response = await fetch(`${apiEndpoint}/delete-fun_time/${funtimeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const message = await response.json();
        throw new Error(message);
      }

      Swal.fire({
        icon: 'success',
        title: 'Funtime Deleted',
        text: 'The funtime has been successfully deleted!',
      });

      setFuntimes((prevFuntimes) => prevFuntimes.filter(funtime => funtime.funtimeId !== funtimeId));
    } catch (error) {
      console.error('Error deleting funtime:', error);
    }
  }

  if (isLoading)
    return <h2 className="text-2xl text-center mt-12">Loading...</h2>;

  return (
    <div id='event-holder' className="bg-light overflow-auto">
      <h4>FUNTIMES</h4>
      <div className="mx-auto">
        {errorMsg ? <p>{errorMsg}</p> : funtimes.length > 0 ? funtimes.map(event => (
          <FuntimeCard
            key={event.id}
            event={event}
            handleSubmit={handleSubmit}
            deleteFuntime={deleteFuntime}
          />
        )) : (
          <p className='p-5 alert alert-warning'>
            <i className="fas fa-circle-info"></i> Oops! It seems theres no funtimes here, try posting one ;D
          </p>
        )}
      </div>
    </div>
  );
}

const FuntimeCard = ({ event, handleSubmit, deleteFuntime }) => {
  const { funtimeId, image_url, description, total_likes, category, username, liked, comments, handleLike } = event;
  const [localCommentText, setLocalCommentText] = useState('');

  return (
    <div className="card my-4">
      <div className="row no-gutters">
        <div className="col-md-4">
          <i className="fas fa-user fa-fw me-3"></i> User: {username}
          <img src={`data:image/jpeg;base64,${image_url}`} alt="" className="img-fluid" />
        </div>
        <div className="col-md-4 mx-auto">
          <div className="card-body">
            <div className="nav-item me-3 me-lg-1 position-absolute top-0 end-0">
              <div className="d-flex flex-row-reverse">
                <button className="btn btn-outline-danger me-2" onClick={() => deleteFuntime(funtimeId)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
                <Link className="btn btn-outline-dark me-2" to={`/updatefuntime/${funtimeId}`}>
                  <i className="fas fa-edit"></i> Update
                </Link>
              </div>
            </div>
            <h5 className="h3 font-weight-bold">{description}</h5>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted">
                <FontAwesomeIcon
                  icon={liked ? faHeartSolid : faHeart}
                  className={liked ? 'text-danger' : 'text-dark'}
                  onClick={() => handleLike(funtimeId)}
                  style={{ cursor: 'pointer' }}
                /> Likes: {total_likes}
              </span>
              <span className="text-muted">
                <i className="fas fa-list"></i> Category: {category}
              </span>
            </div>
            <div className="px-4 py-2">
              <h3>COMMENTS:</h3>
              <Comment comments={comments} />
              <div className="comment-input" style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffff',
                borderRadius: '25px',
                padding: '10px',
              }}>
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
                  onClick={(e) => { handleSubmit(e, funtimeId, localCommentText); setLocalCommentText(''); }}
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
  event: PropTypes.shape({
    funtimeId: PropTypes.number.isRequired,
    image_url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    total_likes: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    liked: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        text: PropTypes.string,
        user_id: PropTypes.number,
        fun_time_id: PropTypes.number,
      })
    ).isRequired,
    handleLike: PropTypes.func,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  deleteFuntime: PropTypes.func.isRequired,
};

MyFuntimes.propTypes = {
  authToken: PropTypes.string,
  apiEndpoint: PropTypes.string,
  isLoading: PropTypes.bool,
  onchange: PropTypes.bool,
  funtimes: PropTypes.arrayOf(
    PropTypes.shape({
      funtimeId: PropTypes.number,
      image_url: PropTypes.string,
      description: PropTypes.string,
      total_likes: PropTypes.number,
      category: PropTypes.string,
      username: PropTypes.string,
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
  ),
  errorMsg: PropTypes.string,
  setOnchange: PropTypes.func,
  setFuntimes: PropTypes.func,
};

MyFuntimes.defaultProps = {
  authToken: '',
  apiEndpoint: '',
  isLoading: false,
  onchange: false,
  funtimes: [],
  errorMsg: null,
  setOnchange: () => {},
  setFuntimes: () => {},
};


