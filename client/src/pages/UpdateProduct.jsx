import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function EditProduct() {
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    contact_info: '',
  });
  const { authToken, apiEndpoint } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State to hold error message
  
  // Fetch product data immediately when the page loads
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/product/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        const product = response.data.product; // Assuming 'product' is nested within the response data
        setProductData(product);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [id, apiEndpoint, authToken]);

  // Function to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  // Handle the form submission
  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${apiEndpoint}/update-product/${id}`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken && authToken}`,
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product edited",
          showConfirmButton: false,
          timer: 1000
        });
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('You cannot update another users product!'); // Set error message
    }
  };

  // Render error message
  const renderErrorMessage = () => {
    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      );
    }
    return null;
  };

  return (
    <div id='form' className="container py-5">
      <h1 className="text-center mb-4">Edit Product</h1>
      {renderErrorMessage()} {/* Render error message */}
      <form onSubmit={handleUpdateProduct}>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter product title"
                value={productData.title}
                onChange={handleInputChange}
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
                name="description"
                className="form-control"
                placeholder="Enter product description"
                value={productData.description}
                onChange={handleInputChange}
              />
              <label htmlFor="description" className="text-muted">
                Description:
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="number"
                name="price"
                className="form-control"
                placeholder="Enter product price"
                value={productData.price}
                onChange={handleInputChange}
              />
              <label htmlFor="price" className="text-muted">
                Price:
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                name="image_url"
                className="form-control"
                placeholder="Enter image URL"
                value={productData.image_url}
                onChange={handleInputChange}
              />
              <label htmlFor="image_url" className="text-muted"> 
                Image URL:
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                name="contact_info"
                className="form-control"
                placeholder="Enter contact info"
                value={productData.contact_info}
                onChange={handleInputChange}
              />
              <label htmlFor="contact_info" className="text-muted">
                Contact Info:
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <select
                name="category"
                className="form-select rounded"
                value={productData.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Accessories">Accessories</option>
                <option value="Tech">Tech</option>
                <option value="Clothing">Clothing</option>
                <option value="Art">Art</option>
              </select>
              <label htmlFor="category" className="text-muted">
                Category:
              </label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-dark w-100 rounded" >Edit Product</button> 
      </form>
    </div>
  );
}
