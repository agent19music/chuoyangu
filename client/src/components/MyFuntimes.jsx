import  { useState, useEffect, useContext } from 'react';
import '../App.css';
import Comment from './Comment'; 
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function MyFuntimes() {
    const {authToken, apiEndpoint} = useContext(UserContext)
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
            Authorization :  `Bearer ${authToken}`,
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
      e.preventDefault()
  
      if (!localCommentText){
        Swal.fire({
          icon: 'error',
          text: 'Please enter a comment!',
        });
        return;
      }
      if (localCommentText.length > 300){
        Swal.fire({
          icon: 'error',
          text: 'Comment must be 300 characters or less !',
        });
        return;
      }
  
      if(localCommentText !== ''){
        sendComment(localCommentText, funtimeId)
      }
    };
  
    function sendComment(localCommentText, funtimeId){
      fetch(`${apiEndpoint}/comment-event/${funtimeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization :  `Bearer ${authToken && authToken}`,
        },
        body: JSON.stringify({text:localCommentText, funtime_id: funtimeId }),
      })
      .then(res => {
        if(res.ok){
            setOnchange(!onchange)
        }
    })
    
    }

    async function deleteFuntime(funtimeId) {
      try {
          const response = await fetch(`${apiEndpoint}/delete-fun_time/${funtimeId}`, {
              method: 'DELETE',
              headers: {
                  Authorization: `Bearer ${authToken}`,
              }
          });
  
          if (!response.ok) {
              const message = await response.json();
              throw new Error(message);
          }
  
          // Display SweetAlert notification
          Swal.fire({
              icon: 'success',
              title: 'Funtime Deleted',
              text: 'The funtime has been successfully deleted!',
          });
  
          // Filter out the deleted event from the events array
          setFuntimes(funtimes.filter(funtime => funtime.funtimeId !== funtimeId));
  
          return response.json();
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
          {errorMsg ? <p>{errorMsg}</p> : funtimes.length > 0 ? funtimes.map(event => <EventCard key={event.id} event={event} handleSubmit={handleSubmit} deleteFuntime={deleteFuntime}/>) : (
            <p className='p-5 alert alert-warning'>
              <i className="fas fa-circle-info"></i> Oops! It seems there's no funtimes here,try posting one ;D
            </p>
          )}
        </div>
      </div>
    );
  };
  

const EventCard = ({ event, handleSubmit, deleteFuntime }) => {

const { funtimeId, image_url, description, total_likes, category, username, liked, comments, handleLike } = event;
const [localCommentText, setLocalCommentText] = useState('');

return (
<div className="card my-4">
  <div className="row no-gutters">
    <div className="col-md-4">
      <i className="fas fa-user fa-fw me-3"></i> User: {username}
      <img src={image_url} alt="" className="img-fluid"/>
    </div>
    <div className="col-md-4 mx-auto">
      <div className="card-body">
      <div className="nav-item me-3 me-lg-1 position-absolute top-0 end-0">
    <div className="d-flex flex-row-reverse">
        <button className="btn btn-outline-danger me-2" onClick={()=>deleteFuntime(funtimeId)}>
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
            borderRadius: '25px', // Rounded Corners
            padding: '10px' // Inner Spacing
          }}>
            <input
              type="text"
              placeholder="Add a comment..."
              className="form-control mt-2"
              style={{
                backgroundColor: 'transparent',
                border:'black',
                color: 'black', // Text Color
                fontSize: 'large' // Text Size
              }}
              value={localCommentText}
              onChange={(e) => setLocalCommentText(e.target.value)}
            />
            <button 
              className="submit-button" 
              onClick={(e) => {handleSubmit(e, funtimeId, localCommentText); 
              setLocalCommentText('');}} 
              style={{
                backgroundColor: 'transparent',
                border: 'none'
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
