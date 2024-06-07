import  { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function AddFunTime() {
  const navigate = useNavigate()
  const { apiEndpoint, authToken} = useContext(UserContext);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!description || !imageFile || !category) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image_data', imageFile)
    formData.append('category', category)
  
    try {
      const response = await fetch(`${apiEndpoint}/add-fun_time`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData, // Pass formData to body
      });
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Fun-Time added successfully!',
        });
        // Reset form fields
        setDescription('');
        setImageFile('');
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
              type="file"
              id="imageFile"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])} // Change this line
            />
            <label htmlFor="imageFile" className="text-muted">
              Image File:
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
                <option value="Funny">Funny</option>
                <option value="Events">Events</option>
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
