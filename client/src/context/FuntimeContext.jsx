import { createContext, useEffect, useState} from "react";
import PropTypes from 'prop-types'; // Add this line

export const FuntimeContext = createContext();

export default function FuntimeProvider({children}){

    const apiEndpoint = "http://127.0.0.1:5000"
    const [isLoading, setIsLoading] = useState(false);
    const [onchange, setOnchange] = useState(false);
    const [funtimes, setFuntimes] = useState([]);


    useEffect(() => {
        setIsLoading(true);
        fetch(`${apiEndpoint}/fun_times`)
          .then((res) => res.json())
          .then((data) => {
            console.log('Data from fetch:', data);
            setFuntimes(data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          });
      }, [onchange, apiEndpoint]);
   


   

    const contextData = {
      
         funtimes,
         setOnchange,
         setFuntimes,
         isLoading
    };
    
    
        return (
            <FuntimeContext.Provider value={contextData}>
                {children}
            </FuntimeContext.Provider>
        );

}

// Add prop type validation
FuntimeProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };