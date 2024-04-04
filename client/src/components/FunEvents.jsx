import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import Comment from './Comment'; 
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';

const FunEvents = () => {
  const {authToken, apiEndpoint} = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false);
  const [onchange, setOnchange] = useState(false);
  const [events, setEvents] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);


  useEffect(() => {
    setIsLoading(true);
    fetch(`${apiEndpoint}/events/fun`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Data from fetch:', data);
        if (Array.isArray(data.events)) {
          setEvents(data.events);
        } else if (typeof data === 'object' && data.message) {
          setErrorMsg(data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [apiEndpoint, onchange]);


  function handleSubmit(e, eventId, localCommentText) {
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
      sendComment(localCommentText, eventId)
    }
  };

  function sendComment(localCommentText, eventId){
    fetch(`${apiEndpoint}/comment-event/${eventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization :  `Bearer ${authToken && authToken}`,
      },
      body: JSON.stringify({text:localCommentText, event_id: eventId }),
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
      <h4>EVENTS</h4>
      <div className="mx-auto">
        {errorMsg ? <p>{errorMsg}</p> : events.length > 0 ? events.map(event => <EventCard key={event.id} event={event} handleSubmit={handleSubmit} />) : (
          <p className='p-5 alert alert-warning'>
            <i className="fas fa-circle-info"></i> Oops! It seems there's no events here, check back later ;D
          </p>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event, handleSubmit }) => {
  const [localCommentText, setLocalCommentText] = useState('');
  const { id, poster, title, description, date, entry_fee, comments } = event;
  return (
    <div className="card my-4">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img src={poster} alt="" className="img-fluid"/>
        </div>
        <div className="col-md-4 mx-auto">
          <div className="card-body">
            <h1 className="h3 font-weight-bold">{title}</h1>
            <p>{description}</p>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted">
                <i className="far fa-calendar"></i> Date: {date}
              </span>
              <span className="text-muted">
                <i className="fas fa-money-check"></i> Entry: {entry_fee}
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
                  onClick={(e) => {handleSubmit(e, id, localCommentText); 
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

export default FunEvents;
