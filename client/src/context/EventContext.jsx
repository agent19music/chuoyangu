import React, { createContext, useState, useEffect, useCallback } from 'react';

export const EventContext = createContext();

const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onChange, setOnchange] = useState(false);

  const apiEndpoint = 'http://127.0.0.1:5000'; // Replace this with your actual API endpoint

  const fetchAllEvents = useCallback(() => {
    setIsLoading(true);
    fetch(`${apiEndpoint}/events`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [apiEndpoint]);

  const fetchEventsByCategory = useCallback((category) => {
    setIsLoading(true);
    fetch(`${apiEndpoint}/${category}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [apiEndpoint]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents, onChange]);

  return (
    <EventContext.Provider value={{ events, isLoading, setOnchange, fetchAllEvents, fetchEventsByCategory }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
