import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateEvent() {
  const navigate = useNavigate()
  const { authToken, apiEndpoint } = useContext(UserContext);
  const { eventId } = useParams();

  // State variables for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [dateOfEvent, setDateOfEvent] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const getTimestamp = (time) => {
    // Split the time input into hours and minutes
    const [hours, minutes] = time.split(':');
  
    // Create a Date object with the provided hours and minutes
    const date = new Date();
    date.setHours(hours, minutes);
  
    // Format the time in the 12-hour clock format with an AM/PM indicator
    const hoursFormatted = (date.getHours() % 12 || 12).toString().padStart(2, '0'); // Convert to 12-hour format and zero-pad
    const period = date.getHours() >= 12 ? 'PM' : 'AM'; // Get the AM/PM indicator
  
    return `${hoursFormatted}:${minutes} ${period}`;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-GB', options);
  };



  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const eventData = await response.json();
          setTitle(eventData.title || '');
          setDescription(eventData.description || '');
          setStartDateTime(eventData.start_time || '');
          setEndDateTime(eventData.end_time || '');
          setDateOfEvent(eventData.date || '');
          setEntryFee(eventData.entryFee || '');
          setCategory(eventData.category || '');
          setImageUrl(eventData.poster || '');
        } else {
          throw new Error('Failed to fetch event data');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
  
    fetchEventData();
  }, [eventId, apiEndpoint, authToken]);
  

  const updateEvent = async () => {
    const formData = {
      title,
      description,
      date_of_event: formatDate(dateOfEvent),
      start_time: getTimestamp(startDateTime),
      end_time: getTimestamp(endDateTime),
      Entry_fee: entryFee,
      category,
      image_url: imageUrl,
    };

    try {
      const response = await fetch(`${apiEndpoint}/update-event/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Event updated successfully!',
        });
        navigate('/myprofile/myevents')
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateEvent();
  };

  return (
    <div id="form" className="container py-5">
      <h1 className="text-center mb-4">Update Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="title" className="text-muted">
                Title:
              </label>
            </div>
                </div>
                <div className="col-md-6">
        <div className="form-floating mb-3">
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <label htmlFor="description" className="text-muted">
            Description:
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-3">
          <input
            type="time"
            id="startDateTime"
            name="startDateTime"
            className="form-control"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
          />
          <label htmlFor="startDateTime" className="text-muted">
            Start Time:
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-3">
          <input
            type="time"
            id="endDateTime"
            name="endDateTime"
            className="form-control"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
          />
          <label htmlFor="endDateTime" className="text-muted">
            End Time:
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-3">
          <input
            type="date"
            id="dateOfEvent"
            name="dateOfEvent"
            className="form-control"
            value={dateOfEvent}
            onChange={(e) => setDateOfEvent(e.target.value)}
          />
          <label htmlFor="dateOfEvent" className="text-muted">
            Date of Event:
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-3">
          <input
            type="text"
            id="entryFee"
            name="entryFee"
            className="form-control"
            placeholder="Enter entry fee"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
          />
          <label htmlFor="entryFee" className="text-muted">
            Entry Fee:
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-3">
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            className="form-control"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <label htmlFor="imageUrl" className="text-muted">
            Poster URL:
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-3">
          <select
            id="category"
            name="category"
            className="form-select rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Fun">Fun</option>
            <option value="Social">Social</option>
            <option value="Educational">Educational</option>
          </select>
          <label htmlFor="category" className="text-muted">
            Category:
          </label>
        </div>
      </div>

        </div>
        <button className="btn btn-dark w-100 rounded" type="submit">Update Event</button>
      </form>
    </div>
  );
}
