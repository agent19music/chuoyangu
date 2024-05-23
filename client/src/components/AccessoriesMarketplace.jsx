import  { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../App.css';
import ProductCard from './ProductCard';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

const AccessoriesProduct = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [onchange, setOnchange] = useState(false);
  const { authToken, apiEndpoint } = useContext(UserContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = apiEndpoint + '/marketplace/accessories';
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }
        const response = await axios.get(url);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [selectedCategory,apiEndpoint]);

  // Function to handle deleting a product, only if the product's user_id matches the current user
  const handleDeleteProduct = (id) => {
   axios.delete(`${apiEndpoint}/delete-product/${id}`, {
     headers: {
       'Content-Type': 'application/json',
       Authorization: `Bearer ${authToken && authToken}`
     }
   })
     .then(res => {
       if (res.status === 200) {
         // logic to update the state of the component
         setProducts(products.filter(product => product.id !== id));

         setOnchange(!onchange);
       }else if (res.status === 401) {
        // Handle other status codes here
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The Product must be your own",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
      }
    })
    .catch(error => {
      console.error('Error deleting product:', error.response.data); // Log the error response from the server
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The Product must be your own",// Show the error message from the server response
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    });
};




  return (
    <div id='event-holder' className="bg-light overflow-auto">
      <h4>MARKETPLACE</h4>
      <div className="mx-auto">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} handleDeleteProduct={handleDeleteProduct} />
        ))}
      </div>
    </div>
  );
};

export default AccessoriesProduct;
