import  { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateFuntime() {
    const navigate = useNavigate()
  const { authToken, apiEndpoint } = useContext(UserContext);
  const { funtimeId } = useParams();

  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');

  

  useEffect(() => {
    const fetchFuntimeData = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/get-fun_time/${funtimeId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          console.log(response.json());
          const funtimeData = await response.json();
          console.log(funtimeData.output);
          setDescription(funtimeData.output.description || '');
          setImageUrl(funtimeData.output.image_url || '');
          setCategory(funtimeData.output.category || '');
        } else {
          throw new Error('Failed to fetch funtime data');
        }
      } catch (error) {
        console.error('Error fetching funtime data:', error);

      }
    };
  
    fetchFuntimeData();
  }, [funtimeId, apiEndpoint, authToken]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${apiEndpoint}/update-fun_time/${funtimeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ description, image_url: imageUrl, category }),
      });
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Funtime updated successfully!',
        });
        navigate('/myprofile/myfuntimes')
      } else {
        throw new Error('Failed to update funtime');
      }
    } catch (error) {
      console.error('Error updating funtime:', error);
    }
  };

  return (
    <div id="form" className="container py-5">
      <h1 className="text-center mb-4">Update Fun-Time</h1>
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
        <button className="btn btn-dark w-100 rounded" type="submit">
          Update Fun-Time
        </button>
      </form>
    </div>
  );
}
