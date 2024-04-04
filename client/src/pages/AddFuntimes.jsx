import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function AddFunTime() {
  const navigate = useNavigate()
  const { apiEndpoint, authToken} = useContext(UserContext);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!description || !imageUrl || !category) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields',
      });
      return;
    }

    try {
      const response = await fetch(`${apiEndpoint}/add-fun_time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          description,
          image_url: imageUrl,
          category,
        }),
      });
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Fun-Time added successfully!',
        });
        // Reset form fields
        setDescription('');
        setImageUrl('');
        setCategory('');
        navigate('/')
      }
       else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding Fun-Time:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add Fun-Time',
      });
    }
  };

  return (
    <div id='form' className="container py-5">
      <h1 className="text-center mb-4">Add Fun-Time</h1>
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="description"
                className="form-control"
                placeholder="Enter Fun-Time description"
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
                type="text"
                id="imageUrl"
                className="form-control"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <label htmlFor="imageUrl" className="text-muted">
                Image URL:
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
                <option value="Funny">Fun</option>
                <option value="Events">Social</option>
                <option value="Educational">Educational</option>
              </select>
              <label htmlFor="category" className="text-muted">
                Category:
              </label>
            </div>
            </div>
        </div>
        <button className="btn btn-dark w-100 rounded" type="submit">Add Fun-Time</button>
      </form>
    </div>
  );
}
