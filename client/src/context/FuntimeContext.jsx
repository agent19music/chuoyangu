import { createContext} from "react";
import PropTypes from 'prop-types'; // Add this line

export const FuntimeContext = createContext();

export default function FuntimeProvider({children}){

    const apiEndpoint = "http://127.0.0.1:5000"
   


   

    const contextData = {
      
         apiEndpoint
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