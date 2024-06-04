import React, { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

export const EventContext = createContext();

export default function EventProvider({ children }) {
  const apiEndpoint = "http://127.0.0.1:5000";
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [onchange, setOnchange] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${apiEndpoint}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [onchange, apiEndpoint]);

  const contextData = {
    apiEndpoint,
    events,
    isLoading,
    onchange,
    setOnchange
  };

  return (
    <EventContext.Provider value={contextData}>
      {children}
    </EventContext.Provider>
  );
}

EventProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
