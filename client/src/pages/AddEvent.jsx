import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function AddEvent() {
  const navigate = useNavigate()
  const {authToken, currentUser, apiEndpoint} = useContext(UserContext);
  let userId = currentUser.id;
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

  const addEvent = async (formData) => { // Updated to accept formData
    try {
      const response = await fetch(`${apiEndpoint}/add-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...formData, // Use the form data directly
          date_of_event: formatDate(formData.date_of_event),
          start_time: getTimestamp(formData.start_time),
          end_time: getTimestamp(formData.end_time),
          user_id: userId,
        }),
      });
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Event added successfully!',
        });
       
        // Reset form fields
        setTitle('');
        setDescription('');
        setStartDateTime('');
        setEndDateTime('');
        setDateOfEvent('');
        setEntryFee('');
        setCategory('');
        setImageUrl('');
        navigate('/myprofile/myevents')
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Check if any required field is empty
    if (!title || !description || !startDateTime || !endDateTime || !dateOfEvent || !entryFee || !category || !imageUrl) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields',
      });
      return;
    }
  
    // Call addEvent function with the form data
    await addEvent({
      title,
      description,
      start_time: startDateTime,
      end_time: endDateTime,
      date_of_event: dateOfEvent,
      Entry_fee: entryFee,
      category,
      image_url: imageUrl,
    });
  };

  return (
    <div id='form' className="container py-5">
      <h1 className="text-center mb-4">Add Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="title"
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
              <input
                type="text"
                id="description"
                className="form-control"
                placeholder="Enter event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
        <button className="btn btn-dark w-100 rounded" type="submit">Add Event</button>
      </form>
    </div>
  );
}
