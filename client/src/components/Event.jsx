import React, { useState, useContext } from 'react';
import '../App.css';
import Comment from './Comment'; 
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { EventContext } from '../context/EventContext';
import PropTypes from 'prop-types'

const Event = () => {
  const { authToken, apiEndpoint } = useContext(UserContext);
  const { events, isLoading, setOnchange } = useContext(EventContext);

  console.log(events);

  function handleSubmit(e, eventId, localCommentText) {
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
      sendComment(localCommentText, eventId);
    }
  }

  function sendComment(commentText, eventId) {
    fetch(`${apiEndpoint}/comment-event/${eventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken && authToken}`,
      },
      body: JSON.stringify({ text: commentText, event_id: eventId }),
    })
    .then(res => {
      if (res.ok) {
        setOnchange(prev => !prev);
      }
    });
  }

  if (isLoading) return <h2 className="text-2xl text-center mt-12">Loading...</h2>;

  return (
    <div id='event-holder' className="bg-light overflow-auto">
      <h4 className='page-title'>EVENTS</h4>
      <div className="mx-auto">
        {events && events.map((event, index) => (
          <EventCard key={index} {...event} handleSubmit={handleSubmit} />
        ))}
      </div>
    </div>
  );
};

const EventCard = ({ poster, title, description, date, entry_fee, comments, eventId, handleSubmit }) => {
  const [localCommentText, setLocalCommentText] = useState('');

  return (
    <div className="card my-4">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img src={`data:image/jpeg;base64,${poster}`} alt="" className="img-fluid" />
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
                borderRadius: '25px',
                padding: '10px'
              }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="form-control mt-2"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'black',
                    color: 'black',
                    fontSize: 'large'
                  }}
                  value={localCommentText}
                  onChange={(e) => setLocalCommentText(e.target.value)}
                />
                <button
                  className="submit-button"
                  onClick={(e) => { handleSubmit(e, eventId, localCommentText); setLocalCommentText(''); }}
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

EventCard.propTypes = {
  poster: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  entry_fee: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    username: PropTypes.string.isRequired,
    dateCreated: PropTypes.string.isRequired
  })).isRequired,
  eventId: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default Event;