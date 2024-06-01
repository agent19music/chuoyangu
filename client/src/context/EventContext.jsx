import { createContext, useEffect, useState} from "react";
import PropTypes from 'prop-types'; // Add this line

export const EventContext = createContext();

export default function EventProvider({children}){

    const apiEndpoint = "http://127.0.0.1:5000"

    const [isLoading, setIsLoading] = useState(false)
    const [events, setEvents] = useState([])
    const [onchange, setOnchange] = useState(false)

    useEffect(()=>{
        setIsLoading(true);
        fetch(`${apiEndpoint}/events`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data.events);
            setEvents(data.events)
            setIsLoading(false)
          })
          .catch((error) => {
            console.error('Error fetching data:', error)
            setIsLoading(false)
          })
      },[onchange, apiEndpoint]);
   


   

    const contextData = {
      
         apiEndpoint,
         events,
         isLoading
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