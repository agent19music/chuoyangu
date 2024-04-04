import React, { useState,useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [onchange, setOnchange] = useState(false);
  const { authToken, apiEndpoint } = useContext(UserContext);


  const handleAddProduct = (event) => {
    event.preventDefault();
    axios.post(`${apiEndpoint}/create-product`, {
      title:title,
      description: description,
      price: price,
      image_url: imageUrl,
      category: category,
      contact_info: contactInfo
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization :  `Bearer ${authToken && authToken}`
      },
    } )
    .then(res => {
      if(res.status === 200) {
        setOnchange(!onchange);
         // Reset form fields after successful submission
        setTitle('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        setCategory('');
        setContactInfo('');
        navigate('/marketplace')
      }
    })
    .catch(error => {
      console.error('Error posting review:', error);
    });
    console.log('Product added:', { title, description, price, imageUrl, category });
  };
  return (
    <div id='form'className="container py-5">
  <h1 className="text-center mb-4">Add Product</h1>
  <form onSubmit={handleAddProduct}>
    <div className="row g-4">
      <div className="col-md-6">
        <div className="form-floating mb-3">
          <input
            type="text"
            id="title"
            className="form-control"
            placeholder="Enter product title"
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
            placeholder="Enter product description"
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
            type="number"
            id="price"
            className="form-control"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
          <input
            type="number"
            id="price"
            className="form-control"
            placeholder="Enter product price"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
          <label htmlFor="price" className="text-muted">
            Contact Info:
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
    <button className="btn btn-dark w-100 rounded" onClick={handleAddProduct}>Add Product</button>
  </form>
</div>

  )
}
