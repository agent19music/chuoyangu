import { React, createContext, useState,useEffect} from "react";
import PropTypes from 'prop-types'; // Add this line

export const MarketplaceContext = createContext();

export default function MarketplaceProvider({children}){

    const apiEndpoint = "http://127.0.0.1:5000"
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([])
    const [category, setCategory] = useState('Food'); // Default category




    useEffect(() => {
        setIsLoading(true); // Ensure loading state is true before fetching
        fetch(`${apiEndpoint}/marketplace`)
            .then((res) => res.json())
            .then((res) => {
                setProducts(res);
                setIsLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
                setProducts([]);
                setIsLoading(false); // Ensure loading is set to false even if there's an error
            });
    }, []);

    useEffect(() => {
        if (category) {
          const filtered = products.filter(product => product.category === category);
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(products);
        }
      }, [category, products]);

    const contextData = {
       apiEndpoint,
       products: filteredProducts,
       isLoading,
       setCategory
         
    };

    console.log(products);
    
        return (
            <MarketplaceContext.Provider value={contextData}>
                {children}
            </MarketplaceContext.Provider>
        );

}

// Add prop type validation
MarketplaceProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };