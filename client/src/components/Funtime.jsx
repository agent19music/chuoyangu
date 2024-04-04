import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import Comment from './Comment';

export default function Funtime() {
  const [funtimes, setFuntimes] = useState([]);

  const {authToken, currentUser, apiEndpoint} = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false);
  const [onchange, setOnchange] = useState(false);
  // let userId = currentUser.id;
 

  useEffect(() => {
    setIsLoading(true);
    fetch(`${apiEndpoint}/fun_times`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Data from fetch:', data.fun_times);
        setFuntimes(data.fun_times);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [onchange, apiEndpoint]);

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
          if (funTime.id === funtimeId) {
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
  
  // Use useEffect to show the success message after funtimes state updates
  useEffect(() => {
    console.log('liked');
  }, [funtimes]);
  // const handleLike = (index) => {
  //   const updatedFuntimes = [...funtimes];
  //   updatedFuntimes[index].liked = !updatedFuntimes[index].liked;
  //   if (updatedFuntimes[index].liked) {
  //     updatedFuntimes[index].total_likes += 1;
  //   } else {
  //     updatedFuntimes[index].total_likes -= 1;
  //   }
  //   setFuntimes(updatedFuntimes);
  // };
  
  


  

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
    fetch(`${apiEndpoint}/comment-fun_time/${funtimeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization :  `Bearer ${authToken && authToken}`,
      },
      body: JSON.stringify({text:localCommentText, fun_time_id: funtimeId }),
    })
    .then(res => {
      if(res.ok){
          setOnchange(!onchange)
      }
  })
  
  }
  if (isLoading)
  return <h2 className="text-2xl text-center mt-12">Loading...</h2>;

  return (
    <div id='event-holder' className="bg-light overflow-auto">
      <h4>FUNTIMES</h4>
      <div className="mx-auto">
        {funtimes && funtimes.map((event, index) => (
          <EventCard
            key={index}
            index={index}
            {...event}
            funtimeId={event.funtimeId}
            userId = {currentUser.id}
            handleLike={handleLike}
            handleSubmit ={handleSubmit}
          />
        ))}
      </div>
    </div>
  );
}

const EventCard = ({ index, image_url, description, total_likes, category, username, liked, comments, handleLike, handleSubmit, funtimeId, userId }) => {

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
            <h5 className="h3 font-weight-bold">{description}</h5>
            <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="text-muted">
              <i className="far fa-heart" onClick={() => handleLike(index)} style={{ cursor: 'pointer' }} ></i> Likes: {total_likes}
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
                 <i class="fas fa-arrow-up"></i>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

