import { React, createContext, useState,useEffect} from "react";
import PropTypes from 'prop-types'; // Add this line

export const StudentContext = createContext();

export default function StudentProvider({children}){

    const apiEndpoint = "http://127.0.0.1:5000"
    const [students, setStudents] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [filteredStudents, setFilteredStudents] = useState([])
    const [category, setCategory] = useState('Food'); // Default category




    useEffect(() => {
        setIsLoading(true); // Ensure loading state is true before fetching
        fetch(`${apiEndpoint}/marketplace`)
            .then((res) => res.json())
            .then((res) => {
                setStudents(res);
                setIsLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
                setStudents([]);
                setIsLoading(false); // Ensure loading is set to false even if there's an error
            });
    }, []);

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
       products: filteredStudents,
       isLoading,
       setCategory
         
    };

    console.log(products);
    
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