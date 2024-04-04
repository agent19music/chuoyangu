import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import Comment from './Comment'; 
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';


export default function MyEvents() {
    const {authToken, apiEndpoint} = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(false);
    const [onchange, setOnchange] = useState(false);
    const [events, setEvents] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
  
  
    useEffect(() => {
        setIsLoading(true);
        fetch(`${apiEndpoint}/user-events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization :  `Bearer ${authToken}`,
          },
        })
        .then((res) => res.json())
        .then((data) => {
          console.log('Data from fetch:', data);
          if (Array.isArray(data.user_events)) {
            setEvents(data.user_events);
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

    async function deleteEvent(id) {
      try {
          const response = await fetch(`${apiEndpoint}/delete-event/${id}`, {
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
              title: 'Event Deleted',
              text: 'The event has been successfully deleted!',
          });
  
          // Filter out the deleted event from the events array
          setEvents(events.filter(event => event.id !== id));
  
          return response.json();
      } catch (error) {
          console.error('Error deleting event:', error);
      }
  }
  
    if (isLoading)
      return <h2 className="text-2xl text-center mt-12">Loading...</h2>;
  
    return (
      <div id='event-holder' className="bg-light overflow-auto">
        <h4>EVENTS</h4>
        <div className="mx-auto">
          {errorMsg ? <p>{errorMsg}</p> : events.length > 0 ? events.map(event => <EventCard key={event.id} event={event} handleSubmit={handleSubmit}  deleteEvent={deleteEvent}/>) : (
            <p className='p-5 alert alert-warning'>
              <i className="fas fa-circle-info"></i> Oops! It seems there's no events here,try posting an event ;D
            </p>
          )}
        </div>
      </div>
    );
  };
  
  const EventCard = ({ event, handleSubmit,deleteEvent }) => {
    const [localCommentText, setLocalCommentText] = useState('');
    const { id, poster, title, description, date, entry_fee, comments } = event;

    
    return (
      <div className="card my-4">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img src={poster} alt="" className="img-fluid"/>
        </div>
        <div className="col-md-4 mx-auto">
        <div className="card-body position-relative"> {/* Add position-relative here */}
        {/* Hamburger icon */}
        <div className="nav-item me-3 me-lg-1 position-absolute top-0 end-0">
    <div className="d-flex flex-row-reverse">
        <button className="btn btn-outline-danger me-2" onClick={() => deleteEvent(id)}>
            <i className="fas fa-trash-alt"></i> Delete
        </button>
        <Link className="btn btn-outline-dark me-2" to={`/updateevent/${id}`}>
            <i className="fas fa-edit"></i> Update
        </Link>
    </div>
</div>

            
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
}
