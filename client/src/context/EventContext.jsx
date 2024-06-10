import React, { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

export const EventContext = createContext();

export default function EventProvider({ children }) {
  const apiEndpoint = "http://127.0.0.1:5000";
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [onchange, setOnchange] = useState(false);
  const [category, setCategory] = useState('Fun'); // Default category

  useEffect(() => {
    setIsLoading(true);
    fetch(`${apiEndpoint}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data); // Initially set filteredEvents to all events
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setEvents([]);
        setFilteredEvents([]);
        setIsLoading(false);
      });
  }, [apiEndpoint, onchange]);

  useEffect(() => {
    if (category) {
      const filtered = events.filter(event => event.category === category);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [category, events]);

  const contextData = {
    events: filteredEvents,
    setCategory,
    isLoading,
    onchange,
    setOnchange,
  };

  console.log(events);

  return (
    <EventContext.Provider value={contextData}>
      {children}
    </EventContext.Provider>
  );
}

EventProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
