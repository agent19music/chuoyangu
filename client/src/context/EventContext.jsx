import { createContext} from "react";
import PropTypes from 'prop-types'; // Add this line

export const EventContext = createContext();

export default function EventProvider({children}){

    const apiEndpoint = "http://127.0.0.1:5000"
   


   

    const contextData = {
      
         apiEndpoint
    };
    
    
        return (
            <EventContext.Provider value={contextData}>
                {children}
            </EventContext.Provider>
        );

}

// Add prop type validation
EventProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };