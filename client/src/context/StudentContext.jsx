import { React, createContext, useState,useEffect} from "react";
import PropTypes from 'prop-types'; // Add this line
import axios from "axios";

export const StudentContext = createContext();

export default function StudentProvider({children}){

    const apiEndpoint = "http://127.0.0.1:5000"
    const [students, setStudents] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [onchange, setOnchange] = useState(false);
    const [filteredStudents, setFilteredStudents] = useState([])
    const [category, setCategory] = useState('Software Engineering'); // Default category




    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${apiEndpoint}/users`);
            setStudents(response.data.users);
            // console.log(students); // Update state with fetched users data
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, [apiEndpoint,onchange]);

    useEffect(() => {
        if (category) {
          const filtered = students.filter(student => student.category === category);
          setFilteredStudents(filtered);
        } else {
          setFilteredStudents(students);
        }
      }, [category, students]);

    const contextData = {
       apiEndpoint,
       students: filteredStudents,
       isLoading,
       setCategory
         
    };

    
        return (
            <StudentContext.Provider value={contextData}>
                {children}
            </StudentContext.Provider>
        );

}

// Add prop type validation
StudentProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };