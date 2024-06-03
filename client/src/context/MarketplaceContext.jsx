import { createContext, useState,useEffect} from "react";
import PropTypes from 'prop-types'; // Add this line

export const MarketplaceContext = createContext();

export default function MarketplaceProvider({children}){

    const apiEndpoint = "http://127.0.0.1:5000"
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setIsLoading(true); // Ensure loading state is true before fetching
        fetch(`${apiEndpoint}`)
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

    const contextData = {
       apiEndpoint,
       products,
       isLoading
         
    };
    
    
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